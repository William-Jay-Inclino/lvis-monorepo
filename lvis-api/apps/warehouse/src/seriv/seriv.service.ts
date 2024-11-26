import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSerivInput } from './dto/create-seriv.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { SERIV, Prisma, Item } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS } from '../__common__/types';
import { CreateSerivApproverSubInput } from './dto/create-seriv-approver.sub.input';
import { DB_ENTITY, SETTINGS } from '../__common__/constants';
import { UpdateSerivInput } from './dto/update-seriv.input';
import { CommonService, WarehouseCancelResponse } from '../__common__/classes';
import { getDateRange, getModule, isAdmin, isNormalUser } from '../__common__/helpers';
import { SERIVsResponse } from './entities/serivs-response.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CreateSerivItemSubInput } from './dto/create-seriv-item.sub.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class SerivService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly commonService: CommonService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async create(input: CreateSerivInput) {

        if (!(await this.canCreate(input))) {
            throw new Error('Failed to create SERIV. Please try again')
        }

        await this.commonService.validateItems(input.items)
    
        const serivNumber = await this.getLatestSerivNumber();
        const expDate = await this.commonService.getExpDate(SETTINGS.SERIV_EXP_PERIOD_IN_DAYS);
    
        const data: Prisma.SERIVCreateInput = {
            created_by: this.authUser.user.username,
            seriv_number: serivNumber,
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
            seriv_approvers: {
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
            seriv_items: {
                create: input.items.map(i => {
                    return {
                        item: {connect: {id: i.item_id}},
                        quantity: i.quantity,
                        price: i.price,
                }
                })
            }
        }
        
        const result = await this.prisma.$transaction(async (tx) => {

            const seriv_created = await tx.sERIV.create({ data })

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

            const module = getModule(DB_ENTITY.SERIV)
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: serivNumber,
                reference_table: DB_ENTITY.SERIV,
                description: `${ module.description } no. ${serivNumber}`
            }

            await tx.pending.create({ data: pendingData })


            return seriv_created
        });
    
        return result;
    }

    async update(id: string, input: UpdateSerivInput) {

        const existingItem = await this.prisma.sERIV.findUnique({
            where: { id },
            include: {
                seriv_approvers: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('SERIV not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate(input, existingItem))) {
            throw new Error('Failed to update SERIV. Please try again')
        }

        const data: Prisma.SERIVUpdateInput = {
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


        const result = await this.prisma.sERIV.update({
            data,
            where: { id }
        })
        console.log('Successfully updated SERIV');
        return result

    }

    async cancel(id: string): Promise<WarehouseCancelResponse> {

        const existingItem = await this.prisma.sERIV.findUnique({
            where: { id },
            include: {
                seriv_items: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('SERIV not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        const queries: Prisma.PrismaPromise<any>[] = []
        
        const updateSerivQuery = this.prisma.sERIV.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: this.authUser.user.username,
            },
            where: { id }
        })

        queries.push(updateSerivQuery)

        // delete all associated pendings

        const deleteAssociatedPendings = this.prisma.pending.deleteMany({
            where: {
                reference_number: existingItem.seriv_number
            }
        })

        queries.push(deleteAssociatedPendings)

        // update item qty (decrement based on osriv items qty) 

        for(let serivItem of existingItem.seriv_items) {

            const updateItemQuery = this.prisma.item.update({
                where: { id: serivItem.item_id },
                data: {
                    quantity_on_queue: {
                        decrement: serivItem.quantity
                    }
                }
            })

            queries.push(updateItemQuery)

        }

        const result = await this.prisma.$transaction(queries)

        console.log('Successfully cancelled SERIV');

        return {
            success: true,
            msg: 'Successfully cancelled SERIV',
            cancelled_at: result[0].cancelled_at,
            cancelled_by: result[0].cancelled_by
        }

    }

    async findBy(payload: { id?: string, seriv_number?: string }): Promise<SERIV | null> {
        const item = await this.prisma.sERIV.findFirst({
            include: {
                seriv_items: {
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
                mcrts: true,
            },
            where: {
                OR: [
                    { id: payload.id },
                    { seriv_number: payload.seriv_number }
                ]
            }
        });
    
        if (!item) {
            throw new NotFoundException('SERIV not found');
        }
    
        return item;
    }

    async findAll(page: number, pageSize: number, date_requested?: string, requested_by_id?: string): Promise<SERIVsResponse> {
        console.log('seriv: findAll');
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

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.sERIV.findMany({
                include: {
                    seriv_items: {
                        include: {
                            seriv: {
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
                            },
                            item: {
                                include: {
                                    unit: true,
                                    item_transactions: true,
                                }
                            }
                        }
                    },
                    mcrts: true,
                },
                where: whereCondition,
                orderBy: {
                    seriv_number: 'desc'
                },
                skip,
                take: pageSize,
            }),
            this.prisma.sERIV.count({
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

    async findSerivsBySerivNumber(serivNumber: string, includeDetails: boolean = false) {

		const trimmedSerivNumber = serivNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                seriv_number: true, 
                item_from: true,
                seriv_items: {
                    include: {
                        seriv: {
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
                        },
                        item: {
                            include: {
                                unit: true,
                                item_transactions: true,
                            }
                        }
                    }
                },
                mcrts: true,
            }; 
        } else {
            selectClause = { seriv_number: true };
        }

        const items = await this.prisma.sERIV.findMany({
            select: selectClause,
            where: {
                seriv_number: {
                    startsWith: trimmedSerivNumber
                },
                cancelled_at: null
            },
            orderBy: {
                seriv_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async getStatus(id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.sERIVApprover.findMany({
            where: {
                seriv_id: id,
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

    async canUpdateForm(serivId: string): Promise<Boolean> {

        // if (isAdmin(this.authUser)) {
        //     return true
        // }

        const seriv = await this.prisma.sERIV.findUnique({
            where: {
                id: serivId
            },
            select: {
                created_by: true,
                seriv_approvers: true
            }
        })

        const isOwner = seriv.created_by === this.authUser.user.username || isAdmin(this.authUser)

        if (!isOwner) {
            return false
        }

        const hasApproval = seriv.seriv_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

    private async getLatestSerivNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.sERIV.findFirst({
            where: { seriv_number: { startsWith: currentYear } },
            orderBy: { seriv_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.seriv_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

    private canAccess(item: SERIV): boolean {

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

    private async canCreate(input: CreateSerivInput): Promise<boolean> {

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        if(input.withdrawn_by_id) {
            employeeIds.push(input.withdrawn_by_id)
        }

        if(input.requested_by_id) {
            employeeIds.push(input.requested_by_id)
        }

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

    private async canUpdate(input: UpdateSerivInput, existingItem: SERIV): Promise<boolean> {

        // validates if there is already an approver who take an action
        if (isNormalUser(this.authUser)) {

            console.log('is normal user')

            const approvers = await this.prisma.sERIVApprover.findMany({
                where: {
                    seriv_id: existingItem.id
                }
            })

            const hasAnyNonPendingApprover = approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

            if (hasAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update SERIV. Can only update if all approver's status is pending`)
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
