import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMrvInput } from './dto/create-mrv.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { MRV, Prisma } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { DB_ENTITY, SETTINGS } from '../__common__/constants';
import { UpdateMrvInput } from './dto/update-mrv.input';
import { CommonService, WarehouseCancelResponse } from '../__common__/classes';
import { getDateRange, isAdmin, isNormalUser } from '../__common__/helpers';
import { MRVsResponse } from './entities/mrvs-response.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { endOfYear, startOfYear } from 'date-fns';
import { get_pending_description, getEmployee } from '../__common__/utils';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@Injectable()
export class MrvService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly commonService: CommonService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async create(
        input: CreateMrvInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const authUser = metadata.authUser

        if (!(await this.canCreate({ input, authUser }))) {
            throw new Error('Failed to create MRV. Please try again')
        }

        await this.commonService.validateItems(input.items)
    
        const mrvNumber = await this.getLatestMrvNumber();
        const expDate = await this.commonService.getExpDate(SETTINGS.MRV_EXP_PERIOD_IN_DAYS);
    
        const data: Prisma.MRVCreateInput = {
            created_by: authUser.user.username,
            mrv_number: mrvNumber,
            date_requested: new Date(),
            exp_date: expDate,
            request_type: input.request_type,
            or_number: input.or_number,
            cwo_number: input.cwo_number,
            jo_number: input.jo_number,
            consumer_name: input.consumer_name,
            location: input.location,
            purpose: input.purpose,
            requested_by_id: input.requested_by_id,
            withdrawn_by_id: input.withdrawn_by_id,
            approval_status: APPROVAL_STATUS.PENDING,
            item_from: {
                connect: {
                    id: input.item_from_id
                }
            },
            project: input.project_id ? { connect: { id: input.project_id } } : undefined,
            mrv_approvers: {
                create: input.approvers.map(i => {
                    return {
                        approver_id: i.approver_id,
                        label: i.label,
                        order: i.order,
                        notes: '',
                        status: APPROVAL_STATUS.PENDING,
                    }
                })
            },
            mrv_items: {
                create: input.items.map(i => {
                    return {
                        item: {connect: {id: i.item_id}},
                        quantity: i.quantity,
                        price: i.price,
                    }
                })
            }
        }
    
        return await this.prisma.$transaction(async (tx) => {

            const mrv_created = await tx.mRV.create({
                data,
                include: {
                    mrv_approvers: true,
                    mrv_items: true,
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

            const requisitioner = await getEmployee(mrv_created.requested_by_id, authUser)
            
            const description = get_pending_description({
                employee: requisitioner,
                purpose: mrv_created.purpose,
            })
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: mrvNumber,
                reference_table: DB_ENTITY.MRV,
                description
            }

            await tx.pending.create({ data: pendingData })

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.MRV,
                action: 'CREATE-MRV',
                reference_id: mrv_created.mrv_number,
                metadata: mrv_created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)

            return mrv_created
        });
    
    }

    async update(
        id: string, 
        input: UpdateMrvInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        return await this.prisma.$transaction(async(tx) => {

            const authUser = metadata.authUser

            const existingItem = await tx.mRV.findUnique({
                where: { id }
            })
    
            if (!existingItem) {
                throw new NotFoundException('MRV not found')
            }
    
            if (!this.canAccess({ item: existingItem, authUser })) {
                throw new ForbiddenException('Only Admin and Owner can update this record!')
            }
    
            if (!(await this.canUpdate({ existingItem, tx: tx as unknown as Prisma.TransactionClient, authUser }))) {
                throw new Error('Failed to update MRV. Please try again')
            }

            // new project so delete all mrv_items
            if(input.project_id !== existingItem.project_id) {
                await tx.mRVItem.deleteMany({
                    where: {
                        mrv_id: id
                    }
                })
            }
    
            const data: Prisma.MRVUpdateInput = {
                project: input.project_id
                ? { connect: { id: input.project_id } } 
                : input.project_id === null
                ? { disconnect: true }
                : existingItem.project_id
                ? { connect: { id: existingItem.project_id } } 
                : undefined, 
                purpose: input.purpose ?? existingItem.purpose,
                request_type: input.request_type ?? existingItem.request_type,
                or_number: input.or_number ?? undefined,
                cwo_number: input.cwo_number ?? undefined,
                jo_number: input.jo_number ?? undefined,
                consumer_name: input.consumer_name ?? existingItem.consumer_name,
                location: input.location ?? existingItem.location,
                requested_by_id: input.requested_by_id ?? existingItem.requested_by_id,
                withdrawn_by_id: input.withdrawn_by_id ?? existingItem.withdrawn_by_id,
                item_from: input.item_from_id ? {connect: {id: input.item_from_id}} : {connect: {id: existingItem.item_from_id}},
                updated_by: authUser.user.username,
            }
    
            return await this.prisma.$transaction(async(tx) => {

                const mrv_updated = await tx.mRV.update({
                    data,
                    where: { id }
                })
    
                const pending = await tx.pending.findFirst({
                    where: {
                        reference_number: mrv_updated.mrv_number,
                        reference_table: DB_ENTITY.MRV,
                    }
                })
    
                if(pending) {
    
                    const requisitioner = await getEmployee(mrv_updated.requested_by_id, authUser)
                
                    const description = get_pending_description({
                        employee: requisitioner,
                        purpose: mrv_updated.purpose,
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
                    table: DB_TABLE.MRV,
                    action: 'UPDATE-MRV',
                    reference_id: mrv_updated.mrv_number,
                    metadata: {
                        'old_value': existingItem,
                        'new_value': mrv_updated
                    },
                    ip_address: metadata.ip_address,
                    device_info: metadata.device_info
                }, tx as unknown as Prisma.TransactionClient)
                
                return mrv_updated
    
            })

        })


    }

    async cancel(
        id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<WarehouseCancelResponse> {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.mRV.findUnique({
            where: { id },
            include: {
                mrv_items: true,
            }
        })

        if (!existingItem) {
            throw new NotFoundException('MRV not found')
        }

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        return await this.prisma.$transaction(async(tx) => {

            const mrv_cancelled = await tx.mRV.update({
                data: {
                    cancelled_at: new Date(),
                    cancelled_by: authUser.user.username,
                    approval_status: APPROVAL_STATUS.CANCELLED,
                },
                include: {
                    mrv_items: true,
                },
                where: { id }
            })
    
            // delete associated pending
    
            const pending = await tx.pending.findUnique({
                where: {
                    reference_number_reference_table: {
                        reference_number: existingItem.mrv_number,
                        reference_table: DB_ENTITY.MRV
                    }
                }
            })

            if(pending) {

                await tx.pending.delete({
                    where: { id: pending.id }
                })

            }
    
            // update item qty (decrement based on mrv items qty) 
    
            for(let mrvItem of existingItem.mrv_items) {
    
                await tx.item.update({
                    where: { id: mrvItem.item_id },
                    data: {
                        quantity_on_queue: {
                            decrement: mrvItem.quantity
                        }
                    }
                })
    
            }

            await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.MRV,
				action: 'CANCEL-MRV',
				reference_id: mrv_cancelled.mrv_number,
				metadata: {
					'old_value': existingItem,
					'new_value': mrv_cancelled
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Successfully cancelled MRV',
                cancelled_at: mrv_cancelled.cancelled_at,
                cancelled_by: mrv_cancelled.cancelled_by
            }

        })


    }

    async findBy(payload: { id?: string, mrv_number?: string }): Promise<MRV | null> {
        const item = await this.prisma.mRV.findFirst({
            include: {
                mrv_items: {
                    include: {
                        item: {
                            include: {
                                unit: true,
                                item_transactions: true,
                                item_type: true,
                                project_item: {
                                    include: {
                                        project: true,
                                    }
                                }
                            }
                        }
                    }
                },
                item_from: true,
                project: true,
                mct: true,
            },
            where: {
                OR: [
                    { id: payload.id },
                    { mrv_number: payload.mrv_number }
                ]
            }
        });
    
        if (!item) {
            throw new NotFoundException('MRV not found');
        }
    
        return item;
    }

    async findAll(page: number, pageSize: number, date_requested?: string, requested_by_id?: string, approval_status?: number): Promise<MRVsResponse> {
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

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.mRV.findMany({
                include: {
                    item_from: true,
                    mrv_approvers: true,
                    mct: {
                        select: {
                            mcrts: true
                        }
                    },
                    mrv_items: {
                        include: {
                            mrv: {
                                select: {
                                    mct: {
                                        select: {
                                            mcrts: {
                                                select: {
                                                    id: true,
                                                    cancelled_at: true,
                                                    is_completed: true,
                                                    mcrt_items: true
                                                }
                                            }
                                        }
                                    }
                                },
                            },
                            item: {
                                include: {
                                    unit: true,
                                    item_transactions: true,
                                }
                            }
                        }
                    },
                },
                where: whereCondition,
                orderBy: {
                    mrv_number: 'desc'
                },
                skip,
                take: pageSize,
            }),
            this.prisma.mRV.count({
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

    async findMrvsByMrvNumber(mrvNumber: string) {

		const trimmedMrvNumber = mrvNumber.trim(); 

        const items = await this.prisma.mRV.findMany({
            include: {
                item_from: true,
                mrv_approvers: true,
                mct: {
                    select: {
                        mcrts: true
                    }
                },
                mrv_items: {
                    include: {
                        mrv: {
                            select: {
                                mct: {
                                    select: {
                                        mcrts: {
                                            select: {
                                                id: true,
                                                cancelled_at: true,
                                                is_completed: true,
                                                mcrt_items: true
                                            }
                                        }
                                    }
                                }
                            },
                        },
                        item: {
                            include: {
                                unit: true,
                                item_transactions: true,
                            }
                        }
                    }
                },
            },
            where: {
                mrv_number: {
                    startsWith: trimmedMrvNumber
                },
                cancelled_at: null
            },
            orderBy: {
                mrv_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async getStatus(id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.mRVApprover.findMany({
            where: {
                mrv_id: id,
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

    async isReferenced(mrvId: string): Promise<Boolean> {

        const mct = await this.prisma.mCT.findUnique({
            where: { mrv_id: mrvId }
        })

        if (mct) return true

        return false

    }

    async canUpdateForm(payload: { mrvId: string, authUser: AuthUser }): Promise<Boolean> {

        const { mrvId, authUser } = payload

        const mrv = await this.prisma.mRV.findUnique({
            where: {
                id: mrvId
            },
            select: {
                created_by: true,
                mrv_approvers: true
            }
        })

        const hasPermission = mrv.created_by === authUser.user.username || isAdmin(authUser);

        if (!hasPermission) {
            return false
        }

        const hasApproval = mrv.mrv_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

    private async getLatestMrvNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.mRV.findFirst({
            where: { mrv_number: { startsWith: currentYear } },
            orderBy: { mrv_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.mrv_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

    private canAccess(payload: { item: MRV, authUser: AuthUser }): boolean {

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

    private async canCreate(payload: { input: CreateMrvInput, authUser: AuthUser }): Promise<boolean> {

        const { input, authUser } = payload

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        if(input.withdrawn_by_id) {
            employeeIds.push(input.withdrawn_by_id)
        }

        if(input.requested_by_id) {
            employeeIds.push(input.requested_by_id)
        }

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

    private async canUpdate(payload: { existingItem: MRV, tx?: Prisma.TransactionClient, authUser: AuthUser }): Promise<boolean> {

        const { existingItem, tx, authUser } = payload

        const prismaClient = tx || this.prisma

        // validates if there is already an approver who take an action
        if (isNormalUser(authUser)) {

            const approvers = await prismaClient.mRVApprover.findMany({
                where: {
                    mrv_id: existingItem.id
                }
            })

            const hasAnyNonPendingApprover = approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

            if (hasAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update MRV. Can only update if all approver's status is pending`)
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
