import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMcrtInput } from './dto/create-mcrt.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { MCRT, Prisma } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS } from '../__common__/types';
import { DB_ENTITY } from '../__common__/constants';
import { UpdateMcrtInput } from './dto/update-mcrt.input';
import { WarehouseCancelResponse } from '../__common__/classes';
import { getDateRange, getModule, isAdmin, isNormalUser } from '../__common__/helpers';
import { MCRTsResponse } from './entities/mcrts-response.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { endOfYear, startOfYear } from 'date-fns';
import { get_pending_description, getEmployee } from '../__common__/utils';

@Injectable()
export class McrtService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async create(input: CreateMcrtInput) {

        if (!(await this.canCreate(input))) {
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
            created_by: this.authUser.user.username,
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

            const mcrt_created = await tx.mCRT.create({ data })

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const returned_by = await getEmployee(mcrt_created.returned_by_id, this.authUser)
            
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


            return mcrt_created
        });
    
    }

    async update(id: string, input: UpdateMcrtInput) {

        const existingItem = await this.prisma.mCRT.findUnique({
            where: { id },
            include: {
                mcrt_approvers: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('MCRT not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate(input, existingItem))) {
            throw new Error('Failed to update MCRT. Please try again')
        }

        const data: Prisma.MCRTUpdateInput = {

            note: input.note ?? existingItem.note,

            returned_by_id: input.returned_by_id ?? existingItem.returned_by_id,

            updated_by: this.authUser.user.username,
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

                const returned_by = await getEmployee(mcrt_updated.returned_by_id, this.authUser)
            
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
            
            return mcrt_updated

        })

    }

    async cancel(id: string): Promise<WarehouseCancelResponse> {

        const existingItem = await this.prisma.mCRT.findUnique({
            where: { id },
        })

        if (!existingItem) {
            throw new NotFoundException('MCRT not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        const queries: Prisma.PrismaPromise<any>[] = []
        
        const updateMcrtQuery = this.prisma.mCRT.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: this.authUser.user.username,
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

        queries.push(updateMcrtQuery)

        // delete associated pending

        const deleteAssociatedPending = this.prisma.pending.delete({
            where: {
                reference_number_reference_table: {
                    reference_number: existingItem.mcrt_number,
                    reference_table: DB_ENTITY.MCRT
                }
            }
        })

        queries.push(deleteAssociatedPending)

        const result = await this.prisma.$transaction(queries)

        return {
            success: true,
            msg: 'Successfully cancelled MCRT',
            cancelled_at: result[0].cancelled_at,
            cancelled_by: result[0].cancelled_by
        }

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

    async canUpdateForm(mcrtId: string): Promise<Boolean> {

        // if (isAdmin(this.authUser)) {
        //     return true
        // }

        const mcrt = await this.prisma.mCRT.findUnique({
            where: {
                id: mcrtId
            },
            select: {
                created_by: true,
                mcrt_approvers: true
            }
        })

        const hasPermission = mcrt.created_by === this.authUser.user.username || isAdmin(this.authUser);

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

    private canAccess(item: MCRT): boolean {

        if (isAdmin(this.authUser)) return true

        const isOwner = item.created_by === this.authUser.user.username

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

    private async canCreate(input: CreateMcrtInput): Promise<boolean> {

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        if(input.returned_by_id) {
            employeeIds.push(input.returned_by_id)
        }

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

    private async canUpdate(input: UpdateMcrtInput, existingItem: MCRT): Promise<boolean> {

        // validates if there is already an approver who take an action
        if (isNormalUser(this.authUser)) {

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

            const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

            if (!isValidEmployeeIds) {
                throw new NotFoundException('One or more employee IDs is not valid')
            }

        }

        return true

    }

}
