import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMcrtInput } from './dto/create-mcrt.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { MCRT, Prisma } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { DB_ENTITY } from '../__common__/constants';
import { UpdateMcrtInput } from './dto/update-mcrt.input';
import { WarehouseCancelResponse } from '../__common__/classes';
import { getDateRange, isAdmin, isNormalUser } from '../__common__/helpers';
import { MCRTsResponse } from './entities/mcrts-response.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { endOfYear, startOfYear } from 'date-fns';
import { get_pending_description, getEmployee } from '../__common__/utils';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@Injectable()
export class McrtService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async create(
        input: CreateMcrtInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const authUser = metadata.authUser

        if (!(await this.canCreate({ input, authUser }))) {
            throw new Error('Failed to create MCRT. Please try again')
        }

        const mcrtNumber = await this.getLatestMcrtNumber()

        let mct_number = undefined
        let seriv_number = undefined

        if(input.mct_id) {
            const mct = await this.prisma.mCT.findUnique({
                select: {
                    mct_number: true
                },
                where: { id: input.mct_id }
            })

            if(!mct) {
                throw new NotFoundException('MCT not found with id of ' + input.mct_id)
            }

            mct_number = mct.mct_number

        } else if (input.seriv_id) {
            const seriv = await this.prisma.sERIV.findUnique({
                select: {
                    seriv_number: true
                },
                where: { id: input.seriv_id }
            })

            if(!seriv) {
                throw new NotFoundException('SERIV not found with id of ' + input.seriv_id)
            }

            seriv_number = seriv.seriv_number
        }

        const data: Prisma.MCRTCreateInput = {
            created_by: authUser.user.username,
            mct: input.mct_id ? { connect: { id: input.mct_id } } : undefined,
            mct_number,
            seriv_number,
            seriv: input.seriv_id? { connect: { id: input.seriv_id } } : undefined,
            mcrt_number: mcrtNumber,
            mcrt_date: new Date(),
            returned_by_id: input.returned_by_id,
            note: input.note,
            approval_status: APPROVAL_STATUS.PENDING,
            mcrt_approvers: {
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
            mcrt_items: {
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

            const mcrt_created = await tx.mCRT.create({
                data,
                include: {
                    mcrt_items: true,
                    mcrt_approvers: true,
                }
            })

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const returned_by = await getEmployee(mcrt_created.returned_by_id, authUser)
            
            const description = get_pending_description({
                employee: returned_by,
                purpose: mcrt_created.note,
                label: 'Returned by',
                desc_label: 'Notes'
            })
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: mcrtNumber,
                reference_table: DB_ENTITY.MCRT,
                description,
            }

            await tx.pending.create({ data: pendingData })

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.MCRT,
                action: 'CREATE-MCRT',
                reference_id: mcrt_created.mcrt_number,
                metadata: mcrt_created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)

            return mcrt_created
        });
    
    }

    async update(
        id: string, 
        input: UpdateMcrtInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.mCRT.findUnique({
            where: { id }
        })

        if (!existingItem) {
            throw new NotFoundException('MCRT not found')
        }

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate({ input, existingItem, authUser }))) {
            throw new Error('Failed to update MCRT. Please try again')
        }

        const data: Prisma.MCRTUpdateInput = {

            note: input.note ?? existingItem.note,

            returned_by_id: input.returned_by_id ?? existingItem.returned_by_id,

            updated_by: authUser.user.username,
        }


        return await this.prisma.$transaction(async(tx) => {

            const mcrt_updated = await tx.mCRT.update({
                data,
                where: { id }
            })

            const pending = await tx.pending.findFirst({
                where: {
                    reference_number: mcrt_updated.mcrt_number,
                    reference_table: DB_ENTITY.MCRT,
                }
            })

            if(pending) {

                const returned_by = await getEmployee(mcrt_updated.returned_by_id, authUser)
            
                const description = get_pending_description({
                    employee: returned_by,
                    purpose: mcrt_updated.note,
                    label: 'Returned by',
                    desc_label: 'Notes'
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
				table: DB_TABLE.MCRT,
				action: 'UPDATE-MCRT',
				reference_id: mcrt_updated.mcrt_number,
				metadata: {
					'old_value': existingItem,
					'new_value': mcrt_updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
            
            return mcrt_updated

        })

    }

    async cancel(
        id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<WarehouseCancelResponse> {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.mCRT.findUnique({
            where: { id },
        })

        if (!existingItem) {
            throw new NotFoundException('MCRT not found')
        }

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        return await this.prisma.$transaction(async(tx) => {
            
            const mcrt_cancelled = await tx.mCRT.update({
                data: {
                    cancelled_at: new Date(),
                    cancelled_by: authUser.user.username,
                    approval_status: APPROVAL_STATUS.CANCELLED,
                    mct: {
                        disconnect: true,
                    },
                    seriv: {
                        disconnect: true,
                    }
                },
                where: { id }
            })
    
            // delete associated pending
    
            const pending = await tx.pending.findUnique({
                where: {
                    reference_number_reference_table: {
                        reference_number: existingItem.mcrt_number,
                        reference_table: DB_ENTITY.MCRT
                    }
                }
            })

            if(pending) {

                await tx.pending.delete({
                    where: { id: pending.id }
                })

            }
            
            await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.MCRT,
				action: 'CANCEL-MCRT',
				reference_id: mcrt_cancelled.mcrt_number,
				metadata: {
					'old_value': existingItem,
					'new_value': mcrt_cancelled
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Successfully cancelled MCRT',
                cancelled_at: mcrt_cancelled.cancelled_at,
                cancelled_by: mcrt_cancelled.cancelled_by
            }

        })


    }

    async findBy(payload: { id?: string, mcrt_number?: string }): Promise<MCRT | null> {
        const item = await this.prisma.mCRT.findFirst({
            include: {
                mct: {
                    include: {
                        mrv: true
                    }
                },
                seriv: true,
                mcrt_items: {
                    include: {
                        mcrt: {
                            select: {
                                id: true,
                                seriv: {
                                    select: {
                                        seriv_items: {
                                            select: {
                                                item_id: true,
                                                quantity: true,
                                            }
                                        },
                                        mcrts: {
                                            select: {
                                                id: true,
                                                cancelled_at: true,
                                                is_completed: true,
                                                mcrt_items: true
                                            }
                                        }
                                    }
                                },
                                mct: {
                                    select: {
                                        mrv: {
                                            select: {
                                                mrv_items: {
                                                    select: {
                                                        item_id: true,
                                                        quantity: true,
                                                    }
                                                }
                                            }
                                        },
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
                            }
                        },
                        item: {
                            include: {
                                unit: true,
                                item_transactions: true,
                                item_type: true,
                            }
                        }
                    }
                },
            },
            where: {
                OR: [
                    { id: payload.id },
                    { mcrt_number: payload.mcrt_number }
                ]
            }
        });
    
        if (!item) {
            throw new NotFoundException('MCRT not found');
        }
    
        return item;
    }

    async findAll(page: number, pageSize: number, date_requested?: string, approval_status?: number): Promise<MCRTsResponse> {
        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (date_requested) {
            const { startDate, endDate } = getDateRange(date_requested);

            whereCondition.mcrt_date = {
                gte: startDate,
                lte: endDate,
            };

        }

        if (approval_status) {
            whereCondition.approval_status = approval_status;
        }

        // Default to current year's records if neither filter is provided
        if (!date_requested && !approval_status) {
            const startOfYearDate = startOfYear(new Date());
            const endOfYearDate = endOfYear(new Date());

            whereCondition.created_at = {
                gte: startOfYearDate,
                lte: endOfYearDate,
            };
        }
        


        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.mCRT.findMany({
                where: whereCondition,
                orderBy: {
                    mcrt_number: 'desc'
                },
                skip,
                take: pageSize,
            }),
            this.prisma.mCRT.count({
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

    async findMcrtsByMcrtNumber(mcrtNumber: string, includeDetails: boolean = false) {

		const trimmedMcrtNumber = mcrtNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                mcrt_number: true, 
            }; 
        } else {
            selectClause = { mcrt_number: true };
        }

        const items = await this.prisma.mCRT.findMany({
            select: selectClause,
            where: {
                mcrt_number: {
                    startsWith: trimmedMcrtNumber
                },
                cancelled_at: null
            },
            orderBy: {
                mcrt_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async getStatus(id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.mCRTApprover.findMany({
            where: {
                mcrt_id: id,
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

    async canUpdateForm(payload: { mcrtId: string, authUser: AuthUser }): Promise<Boolean> {

        const { mcrtId, authUser } = payload

        const mcrt = await this.prisma.mCRT.findUnique({
            where: {
                id: mcrtId
            },
            select: {
                created_by: true,
                mcrt_approvers: true
            }
        })

        const hasPermission = mcrt.created_by === authUser.user.username || isAdmin(authUser);

        if (!hasPermission) {
            return false;
        }

        const hasApproval = mcrt.mcrt_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

    private async getLatestMcrtNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.mCRT.findFirst({
            where: { mcrt_number: { startsWith: currentYear } },
            orderBy: { mcrt_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.mcrt_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

    private canAccess(payload: { item: MCRT, authUser: AuthUser }): boolean {

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

    private async canCreate(payload: { input: CreateMcrtInput, authUser: AuthUser }): Promise<boolean> {

        const { input, authUser } = payload

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        if(input.returned_by_id) {
            employeeIds.push(input.returned_by_id)
        }

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

    private async canUpdate(payload: { input: UpdateMcrtInput, existingItem: MCRT, authUser: AuthUser }): Promise<boolean> {

        const { input, existingItem, authUser } = payload

        // validates if there is already an approver who take an action
        if (isNormalUser(authUser)) {

            const approvers = await this.prisma.mCRTApprover.findMany({
                where: {
                    mcrt_id: existingItem.id
                }
            })

            const hasAnyNonPendingApprover = approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

            if (hasAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update MCRT. Can only update if all approver's status is pending`)
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
