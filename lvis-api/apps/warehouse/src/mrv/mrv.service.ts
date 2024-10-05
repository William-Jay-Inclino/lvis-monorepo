import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMrvInput } from './dto/create-mrv.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { AuthUser } from '../__common__/auth-user.entity';
import { Item, MRV, Prisma } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS } from '../__common__/types';
import { CreateMrvApproverSubInput } from './dto/create-mrv-approver.sub.input';
import { DB_ENTITY, SETTINGS } from '../__common__/constants';
import { UpdateMrvInput } from './dto/update-mrv.input';
import { CommonService, WarehouseCancelResponse } from '../__common__/classes';
import { getDateRange, isAdmin, isNormalUser } from '../__common__/helpers';
import { MRVsResponse } from './entities/mrvs-response.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CreateMrvItemSubInput } from './dto/create-mrv-item.sub.input';

@Injectable()
export class MrvService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly commonService: CommonService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async create(input: CreateMrvInput) {

        await this.commonService.validateItems(input.items)
    
        const mrvNumber = await this.getLatestMrvNumber();
        const expDate = await this.commonService.getExpDate(SETTINGS.MRV_EXP_PERIOD_IN_DAYS);
    
        const data: Prisma.MRVCreateInput = {
            created_by: this.authUser.user.username,
            mrv_number: mrvNumber,
            date_requested: new Date(),
            exp_date: expDate,
            request_type: input.request_type,
            or_number: input.or_number,
            mwo_number: input.mwo_number,
            cwo_number: input.cwo_number,
            jo_number: input.jo_number,
            consumer_name: input.consumer_name,
            location: input.location,
            purpose: input.purpose,
            requested_by_id: input.requested_by_id,
            withdrawn_by_id: input.withdrawn_by_id,
            item_from: {
                connect: {
                    id: input.item_from_id
                }
            },
            project: {
                connect: {
                    id: input.project_id
                }
            },
            mrv_approvers: {
                create: input.approvers.map(i => {
                    return {
                        approver_id: i.approver_id,
                        label: i.label,
                        label_id: i.label_id,
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
                        created_by: this.authUser.user.username,
                    }
                })
            }
        }
    
        const result = await this.prisma.$transaction(async (prisma) => {

            const createMrv = prisma.mRV.create({ data });
            const updateItemQuantities = this.generateUpdateItemQueries(input.items)
            const createPending = this.getCreatePendingQuery(input.approvers, mrvNumber);

            await Promise.all([createMrv, ...updateItemQuantities, createPending]);
    
            return createMrv; 
        });
    
        return result;
    }

    private generateUpdateItemQueries(items: CreateMrvItemSubInput[]) {
        return items.map(item => {
            return this.prisma.item.update({
                where: { id: item.item_id },
                data: {
                    quantity_on_queue: {
                        increment: item.quantity
                    }
                }
            });
        });
    }

    private getCreatePendingQuery(approvers: CreateMrvApproverSubInput[], mrvNumber: string) {

        const firstApprover = approvers.reduce((min, obj) => {
            return obj.order < min.order ? obj : min;
        }, approvers[0]);

        const data = {
            approver_id: firstApprover.approver_id,
            reference_number: mrvNumber,
            reference_table: DB_ENTITY.MRV,
            description: `MRV no. ${mrvNumber}`
        }

        return this.prisma.pending.create({ data })

    }

    async update(id: string, input: UpdateMrvInput) {

        const existingItem = await this.prisma.mRV.findUnique({
            where: { id },
            include: {
                mrv_approvers: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('MRV not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate(input, existingItem))) {
            throw new Error('Failed to update MRV. Please try again')
        }

        const data: Prisma.MRVUpdateInput = {
            project: input.project_id ? {connect: {id: input.project_id}} : {connect: {id: existingItem.project_id}},

            purpose: input.purpose ?? existingItem.purpose,
            request_type: input.request_type ?? existingItem.request_type,

            or_number: input.or_number ?? existingItem.or_number,
            mwo_number: input.mwo_number ?? existingItem.mwo_number,
            cwo_number: input.cwo_number ?? existingItem.cwo_number,
            jo_number: input.jo_number ?? existingItem.jo_number,

            consumer_name: input.consumer_name ?? existingItem.consumer_name,
            location: input.location ?? existingItem.location,

            requested_by_id: input.requested_by_id ?? existingItem.requested_by_id,
            withdrawn_by_id: input.withdrawn_by_id ?? existingItem.withdrawn_by_id,
            item_from: input.item_from_id ? {connect: {id: input.item_from_id}} : {connect: {id: existingItem.item_from_id}},

            updated_by: this.authUser.user.username,
        }


        const result = await this.prisma.mRV.update({
            data,
            where: { id }
        })
        console.log('Successfully updated MRV');
        return result

    }

    async cancel(id: string): Promise<WarehouseCancelResponse> {

        const existingItem = await this.prisma.mRV.findUnique({
            where: { id },
            include: {
                mrv_items: true,
            }
        })

        if (!existingItem) {
            throw new NotFoundException('MRV not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        const queries: Prisma.PrismaPromise<any>[] = []
        
        const updateMrvQuery = this.prisma.mRV.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: this.authUser.user.username,
            },
            where: { id }
        })

        queries.push(updateMrvQuery)

        // delete all associated pendings

        const deleteAssociatedPendings = this.prisma.pending.deleteMany({
            where: {
                reference_number: existingItem.mrv_number
            }
        })

        queries.push(deleteAssociatedPendings)

        // update item qty (decrement based on mrv items qty) 

        for(let mrvItem of existingItem.mrv_items) {

            const updateItemQuery = this.prisma.item.update({
                where: { id: mrvItem.item_id },
                data: {
                    quantity_on_queue: {
                        decrement: mrvItem.quantity
                    }
                }
            })

            queries.push(updateItemQuery)

        }

        const result = await this.prisma.$transaction(queries)

        console.log('Successfully cancelled MRV');

        return {
            success: true,
            msg: 'Successfully cancelled MRV',
            cancelled_at: result[0].cancelled_at,
            cancelled_by: result[0].cancelled_by
        }

    }

    async findBy(payload: { id?: string, mrv_number?: string }): Promise<MRV | null> {
        const item = await this.prisma.mRV.findFirst({
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

    async findAll(page: number, pageSize: number, date_requested?: string, requested_by_id?: string): Promise<MRVsResponse> {
        console.log('mrv: findAll');
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
            whereCondition = { ...whereCondition, requested_by_id }
        }
        
        // whereCondition.cancelled_at = {
        //     equals: null,
        // }

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.mRV.findMany({
                include: {
                    item_from: true,
                    mrv_approvers: true,
                    mrv_items: {
                        include: {
                            item: {
                                include: {
                                    unit: true
                                }
                            }
                        }
                    }
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

    async findMrvsByMrvNumber(mrvNumber: string, includeDetails: boolean = false) {

		const trimmedMrvNumber = mrvNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                mrv_number: true, 
                item_from: true
            }; 
        } else {
            selectClause = { mrv_number: true };
        }

        const items = await this.prisma.mRV.findMany({
            select: selectClause,
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

    async canUpdateForm(mrvId: string): Promise<Boolean> {

        if (isAdmin(this.authUser)) {
            return true
        }

        const mrv = await this.prisma.mRV.findUnique({
            where: {
                id: mrvId
            },
            select: {
                created_by: true,
                mrv_approvers: true
            }
        })

        const isOwner = mrv.created_by === this.authUser.user.username

        if (!isOwner) {
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

    private canAccess(item: MRV): boolean {

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

    private async canCreate(input: CreateMrvInput): Promise<boolean> {

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        if(input.withdrawn_by_id) {
            employeeIds.push(input.withdrawn_by_id)
        }

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

    private async canUpdate(input: UpdateMrvInput, existingItem: MRV): Promise<boolean> {

        // validates if there is already an approver who take an action
        if (isNormalUser(this.authUser)) {

            console.log('is normal user')

            const approvers = await this.prisma.mRVApprover.findMany({
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

            const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

            if (!isValidEmployeeIds) {
                throw new NotFoundException('One or more employee IDs is not valid')
            }

        }

        return true

    }

}
