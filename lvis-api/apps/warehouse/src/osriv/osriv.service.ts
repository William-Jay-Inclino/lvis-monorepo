import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOsrivInput } from './dto/create-osriv.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { OSRIV, Prisma } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { DB_ENTITY, SETTINGS } from '../__common__/constants';
import { UpdateOsrivInput } from './dto/update-osriv.input';
import { CommonService, WarehouseCancelResponse } from '../__common__/classes';
import { getDateRange, isAdmin, isNormalUser } from '../__common__/helpers';
import { OSRIVsResponse } from './entities/osrivs-response.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { endOfYear, startOfYear } from 'date-fns';
import { get_pending_description, getEmployee } from '../__common__/utils';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@Injectable()
export class OsrivService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly commonService: CommonService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async create(
        input: CreateOsrivInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const authUser = metadata.authUser

        if (!(await this.canCreate({ input, authUser }))) {
            throw new Error('Failed to create OSRIV. Please try again')
        }

        await this.commonService.validateItems(input.items)
    
        const osrivNumber = await this.getLatestOsrivNumber();
        const expDate = await this.commonService.getExpDate(SETTINGS.OSRIV_EXP_PERIOD_IN_DAYS);
    
        const data: Prisma.OSRIVCreateInput = {
            created_by: authUser.user.username,
            osriv_number: osrivNumber,
            date_requested: new Date(),
            exp_date: expDate,
            purpose: input.purpose,
            requested_by_id: input.requested_by_id,
            item_from: { connect: { id: input.item_from_id } },
            approval_status: APPROVAL_STATUS.PENDING,
            osriv_approvers: {
                create: input.approvers.map(i => ({
                    approver_id: i.approver_id,
                    label: i.label,
                    order: i.order,
                    notes: '',
                    status: APPROVAL_STATUS.PENDING,
                }))
            },
            osriv_items: {
                create: input.items.map(i => ({
                    item: { connect: { id: i.item_id } },
                    quantity: i.quantity,
                    price: i.price,
                }))
            }
        };
    
        return await this.prisma.$transaction(async (tx) => {

            const osriv_created = await tx.oSRIV.create({
                data,
                include: {
                    osriv_approvers: true,
                    osriv_items: true,
                }
            })

            for(let item of input.items) {

                await tx.item.update({
                    where: { id: item.item_id },
                    data: {
                        quantity_on_queue: {
                            increment: item.quantity
                        }
                    }
                })
            }

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const requisitioner = await getEmployee(osriv_created.requested_by_id, authUser)
            
            const description = get_pending_description({
                employee: requisitioner,
                purpose: osriv_created.purpose,
            })
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: osrivNumber,
                reference_table: DB_ENTITY.OSRIV,
                description
            }

            await tx.pending.create({ data: pendingData })

            // create audit
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.OSRIV,
                action: 'CREATE-OSRIV',
                reference_id: osriv_created.osriv_number,
                metadata: osriv_created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)

            return osriv_created

        });
    
    }

    async update(
        id: string, 
        input: UpdateOsrivInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.oSRIV.findUnique({
            where: { id },
        })

        if (!existingItem) {
            throw new NotFoundException('OSRIV not found')
        }

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate({ input, existingItem, authUser }))) {
            throw new Error('Failed to update OSRIV. Please try again')
        }

        const data: Prisma.OSRIVUpdateInput = {
            purpose: input.purpose ?? existingItem.purpose,
            requested_by_id: input.requested_by_id ?? existingItem.requested_by_id,
            item_from: input.item_from_id ? {connect: {id: input.item_from_id}} : {connect: {id: existingItem.item_from_id}},
            updated_by: authUser.user.username,
        }

        return await this.prisma.$transaction(async(tx) => {

            const osriv_updated = await tx.oSRIV.update({
                data,
                where: { id }
            })

            const pending = await tx.pending.findFirst({
                where: {
                    reference_number: osriv_updated.osriv_number,
                    reference_table: DB_ENTITY.OSRIV,
                }
            })

            if(pending) {

                const requisitioner = await getEmployee(osriv_updated.requested_by_id, authUser)
            
                const description = get_pending_description({
                    employee: requisitioner,
                    purpose: osriv_updated.purpose,
                })

                await tx.pending.update({
                    where: {
                        id: pending.id
                    },
                    data: {
                        description
                    }
                })
            }


			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.OSRIV,
				action: 'UPDATE-OSRIV',
				reference_id: osriv_updated.osriv_number,
				metadata: {
					'old_value': existingItem,
					'new_value': osriv_updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)

            
            return osriv_updated

        })


    }

    async cancel(
        id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<WarehouseCancelResponse> {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.oSRIV.findUnique({
            where: { id },
            include: {
                osriv_items: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('OSRIV not found')
        }

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        return await this.prisma.$transaction(async(tx) => {

            // cancel osriv
            const osriv_cancelled = await tx.oSRIV.update({
                data: {
                    cancelled_at: new Date(),
                    cancelled_by: authUser.user.username,
                    approval_status: APPROVAL_STATUS.CANCELLED,
                },
                include: {
                    osriv_items: true
                },
                where: { id }
            })
    
            // delete associated pending
    
            const pending = await tx.pending.findUnique({
                where: {
                    reference_number_reference_table: {
                        reference_number: existingItem.osriv_number,
                        reference_table: DB_ENTITY.OSRIV
                    }
                }
            })

            if(pending) {

                await tx.pending.delete({
                    where: { id: pending.id }
                })

            }
    
            // update item qty (decrement based on osriv items qty) 
    
            for(let osrivItem of existingItem.osriv_items) {
    
                await tx.item.update({
                    where: { id: osrivItem.item_id },
                    data: {
                        quantity_on_queue: {
                            decrement: osrivItem.quantity
                        }
                    }
                })
    
            }

            await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.OSRIV,
				action: 'CANCEL-OSRIV',
				reference_id: osriv_cancelled.osriv_number,
				metadata: {
					'old_value': existingItem,
					'new_value': osriv_cancelled
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Successfully cancelled OSRIV',
                cancelled_at: osriv_cancelled.cancelled_at,
                cancelled_by: osriv_cancelled.cancelled_by
            }

        })


    }

    async findBy(payload: { id?: string, osriv_number?: string }): Promise<OSRIV | null> {
        const item = await this.prisma.oSRIV.findFirst({
            include: {
                osriv_items: {
                    include: {
                        item: {
                            include: {
                                unit: true,
                                item_transactions: true,
                                item_type: true,
                            }
                        }
                    }
                },
                item_from: true,
            },
            where: {
                OR: [
                    { id: payload.id },
                    { osriv_number: payload.osriv_number }
                ]
            }
        });
    
        if (!item) {
            throw new NotFoundException('OSRIV not found');
        }
    
        return item;
    }

    async findAll(page: number, pageSize: number, date_requested?: string, requested_by_id?: string, approval_status?: number): Promise<OSRIVsResponse> {
        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (date_requested) {
            const { startDate, endDate } = getDateRange(date_requested);

            whereCondition.date_requested = {
                gte: startDate,
                lte: endDate,
            };

        }

        if (requested_by_id) {
            whereCondition = { ...whereCondition, requested_by_id }
        }

        if (approval_status) {
            whereCondition.approval_status = approval_status;
        }

        // Default to current year's records if neither filter is provided
        if (!date_requested && !requested_by_id && !approval_status) {
            const startOfYearDate = startOfYear(new Date());
            const endOfYearDate = endOfYear(new Date());

            whereCondition.created_at = {
                gte: startOfYearDate,
                lte: endOfYearDate,
            };
        }
        
        // whereCondition.cancelled_at = {
        //     equals: null,
        // }

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.oSRIV.findMany({
                where: whereCondition,
                orderBy: {
                    osriv_number: 'desc'
                },
                skip,
                take: pageSize,
            }),
            this.prisma.oSRIV.count({
                where: whereCondition,
            })
        ])

        return {
            data: items,
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / pageSize),
        };
    }

    async findOsrivsByOsrivNumber(osrivNumber: string, includeDetails: boolean = false) {

		const trimmedOsrivNumber = osrivNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                osriv_number: true, 
                item_from: true
            }; 
        } else {
            selectClause = { osriv_number: true };
        }

        const items = await this.prisma.oSRIV.findMany({
            select: selectClause,
            where: {
                osriv_number: {
                    startsWith: trimmedOsrivNumber
                },
                cancelled_at: null
            },
            orderBy: {
                osriv_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async getStatus(id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.oSRIVApprover.findMany({
            where: {
                osriv_id: id,
            }
        })

        const hasDisapproved = approvers.find(i => i.status === APPROVAL_STATUS.DISAPPROVED)

        if (hasDisapproved) {
            return APPROVAL_STATUS.DISAPPROVED
        }

        const hasPending = approvers.find(i => i.status === APPROVAL_STATUS.PENDING)

        if (hasPending) {
            return APPROVAL_STATUS.PENDING
        }

        return APPROVAL_STATUS.APPROVED

    }

    async canUpdateForm(payload: { osrivId: string, authUser: AuthUser }): Promise<Boolean> {

        const { osrivId, authUser } = payload

        const osriv = await this.prisma.oSRIV.findUnique({
            where: {
                id: osrivId
            },
            select: {
                created_by: true,
                osriv_approvers: true
            }
        })

        const hasPermission = osriv.created_by === authUser.user.username || isAdmin(authUser);

        if (!hasPermission) {
            return false
        }

        const hasApproval = osriv.osriv_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

    private async getLatestOsrivNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.oSRIV.findFirst({
            where: { osriv_number: { startsWith: currentYear } },
            orderBy: { osriv_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.osriv_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

    private canAccess(payload: { item: OSRIV, authUser: AuthUser }): boolean {

        const { item, authUser } = payload

        if (isAdmin(authUser)) return true

        const isOwner = item.created_by === authUser.user.username

        if (isOwner) return true

        return false

    }

    private async areEmployeesExist(employeeIds: string[], authUser: AuthUser): Promise<boolean> {

        const query = `
            query {
                validateEmployeeIds(ids: ${JSON.stringify(employeeIds)})
            }
        `;

        try {
            const { data } = await firstValueFrom(
                this.httpService.post(
                    process.env.API_GATEWAY_URL,
                    { query },
                    {
                        headers: {
                            Authorization: authUser.authorization,
                            'Content-Type': 'application/json',
                        },
                    }
                ).pipe(
                    catchError((error) => {
                        throw error;
                    }),
                ),
            );

            if (!data || !data.data) {
                return false;
            }

            return data.data.validateEmployeeIds;

        } catch (error) {
            return false;
        }
    }

    private async canCreate(payload: { input: CreateOsrivInput, authUser: AuthUser }): Promise<boolean> {

        const { input, authUser } = payload

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

    private async canUpdate(payload: { input: UpdateOsrivInput, existingItem: OSRIV, authUser: AuthUser }): Promise<boolean> {

        const { input, existingItem, authUser } = payload

        // validates if there is already an approver who take an action
        if (isNormalUser(authUser)) {

            const approvers = await this.prisma.oSRIVApprover.findMany({
                where: {
                    osriv_id: existingItem.id
                }
            })

            const hasAnyNonPendingApprover = approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

            if (hasAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update OSRIV. Can only update if all approver's status is pending`)
            }
        }

        const employeeIds = []

        if (employeeIds.length > 0) {

            const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, authUser)

            if (!isValidEmployeeIds) {
                throw new NotFoundException('One or more employee IDs is not valid')
            }

        }

        return true

    }

}
