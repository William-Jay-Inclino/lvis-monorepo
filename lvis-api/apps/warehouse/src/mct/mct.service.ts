import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMctInput } from './dto/create-mct.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { MCT, Prisma } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS } from '../__common__/types';
import { CreateMctApproverSubInput } from './dto/create-mct-approver.sub.input';
import { DB_ENTITY } from '../__common__/constants';
import { UpdateMctInput } from './dto/update-mct.input';
import { WarehouseCancelResponse } from '../__common__/classes';
import { getDateRange, getModule, isAdmin, isNormalUser } from '../__common__/helpers';
import { MCTsResponse } from './entities/mcts-response.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class MctService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async create(input: CreateMctInput) {

        console.log('mct create', input);

        if (!(await this.canCreate(input))) {
            throw new Error('Failed to create MCT. Please try again')
        }

        const mrv = await this.prisma.mRV.findUnique({
            select: {
                mrv_number: true
            },
            where: { id: input.mrv_id }
        })

        if(!mrv) {
            throw new NotFoundException(`MRV with id ${input.mrv_id} not found in mrv table`)
        }

        const mctNumber = await this.getLatestMctNumber()

        const data: Prisma.MCTCreateInput = {
            created_by: this.authUser.user.username,
            mct_number: mctNumber,
            mrv_number: mrv.mrv_number,
            mct_date: new Date(),
            mrv: { connect: { id: input.mrv_id } },
            mct_approvers: {
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
        }

        const result = await this.prisma.$transaction(async (tx) => {

            const mct_created = await tx.mCT.create({ data })

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const module = getModule(DB_ENTITY.MCT)
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: mctNumber,
                reference_table: DB_ENTITY.MCT,
                description: `${ module.description } no. ${mctNumber}`
            }

            await tx.pending.create({ data: pendingData })


            return mct_created
        });
    
        return result;

    }


    async cancel(id: string): Promise<WarehouseCancelResponse> {

        const existingItem = await this.prisma.mCT.findUnique({
            where: { id },
        })

        if (!existingItem) {
            throw new NotFoundException('MCT not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        const queries: Prisma.PrismaPromise<any>[] = []
        
        const updateMctQuery = this.prisma.mCT.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: this.authUser.user.username,
                mrv: {
                    disconnect: true
                }
            },
            where: { id }
        })

        queries.push(updateMctQuery)

        // delete all associated pendings

        const deleteAssociatedPendings = this.prisma.pending.deleteMany({
            where: {
                reference_number: existingItem.mct_number
            }
        })

        queries.push(deleteAssociatedPendings)

        const result = await this.prisma.$transaction(queries)

        console.log('Successfully cancelled MCT');

        return {
            success: true,
            msg: 'Successfully cancelled MCT',
            cancelled_at: result[0].cancelled_at,
            cancelled_by: result[0].cancelled_by
        }

    }

    async findBy(payload: { id?: string, mct_number?: string }): Promise<MCT | null> {
        const item = await this.prisma.mCT.findFirst({
            include: {
                mcrts: true,
                mrv: {
                    include: {
                    mrv_items: {
                        include: {
                            item: {
                                include: {
                                    unit: true,
                                    item_transactions: true
                                }
                            }
                        }
                    },
                    }
                }
            },
            where: {
                OR: [
                    { id: payload.id },
                    { mct_number: payload.mct_number }
                ]
            }
        });
    
        if (!item) {
            throw new NotFoundException('MCT not found');
        }
    
        return item;
    }

    async findAll(page: number, pageSize: number, date_requested?: string, requested_by_id?: string): Promise<MCTsResponse> {
        console.log('mct: findAll');
        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (date_requested) {
            const { startDate, endDate } = getDateRange(date_requested);
            console.log('startDate', startDate);
            console.log('endDate', endDate)

            whereCondition.date_requested = {
                gte: startDate,
                lte: endDate,
            };

        }

        if (requested_by_id) {
            whereCondition = { ...whereCondition, mrv: { requested_by_id: requested_by_id } }
        }
        
        // whereCondition.cancelled_at = {
        //     equals: null,
        // }

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.mCT.findMany({
                include: {
                    mcrts: {
                        select: {
                            id: true,
                            mcrt_number: true,
                        }
                    },
                    mrv: {
                        include: {
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
                                        }
                                    },
                                    item: {
                                        include: {
                                            unit: true,
                                            item_transactions: true,
                                        }
                                    },
                                }
                            }
                        }
                    },
                },
                where: whereCondition,
                orderBy: {
                    mct_number: 'desc'
                },
                skip,
                take: pageSize,
            }),
            this.prisma.mCT.count({
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

    async findMctsByMctNumber(mctNumber: string, includeDetails: boolean = false) {

		const trimmedMctNumber = mctNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                mct_number: true, 
                mrv: true
            }; 
        } else {
            selectClause = { mct_number: true };
        }

        const items = await this.prisma.mCT.findMany({
            select: selectClause,
            where: {
                mct_number: {
                    startsWith: trimmedMctNumber
                },
                cancelled_at: null
            },
            orderBy: {
                mct_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async getStatus(id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.mCTApprover.findMany({
            where: {
                mct_id: id,
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

    // async isReferenced(mctId: string): Promise<Boolean> {

    //     const mcrt = await this.prisma.mCRT.findUnique({
    //         where: { mct_id: mctId }
    //     })

    //     if (mcrt) return true

    //     return false

    // }

    async update(id: string, input: UpdateMctInput) {
        console.log('TBA: update');
    }

    async canUpdateForm(mctId: string): Promise<Boolean> {

        // if (isAdmin(this.authUser)) {
        //     return true
        // }

        const mct = await this.prisma.mCT.findUnique({
            where: {
                id: mctId
            },
            select: {
                created_by: true,
                mct_approvers: true
            }
        })

        const isOwner = mct.created_by === this.authUser.user.username || isAdmin(this.authUser)

        if (!isOwner) {
            return false
        }

        const hasApproval = mct.mct_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

    private async getLatestMctNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.mCT.findFirst({
            where: { mct_number: { startsWith: currentYear } },
            orderBy: { mct_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.mct_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

    private canAccess(item: MCT): boolean {

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

        console.log('query', query)

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

            console.log('data', data);
            console.log('data.data.validateEmployeeIds', data.data.validateEmployeeIds)

            if (!data || !data.data) {
                console.log('No data returned');
                return false;
            }

            return data.data.validateEmployeeIds;

        } catch (error) {
            console.error('Error querying employees:', error.message);
            return false;
        }
    }

    private async canCreate(input: CreateMctInput): Promise<boolean> {

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

    private async canUpdate(input: UpdateMctInput, existingItem: MCT): Promise<boolean> {

        // validates if there is already an approver who take an action
        if (isNormalUser(this.authUser)) {

            console.log('is normal user')

            const approvers = await this.prisma.mCTApprover.findMany({
                where: {
                    mct_id: existingItem.id
                }
            })

            const hasAnyNonPendingApprover = approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

            if (hasAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update MCT. Can only update if all approver's status is pending`)
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
