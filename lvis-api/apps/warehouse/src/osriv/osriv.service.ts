import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOsrivInput } from './dto/create-osriv.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { AuthUser } from '../__common__/auth-user.entity';
import { OSRIV, Prisma } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS } from '../__common__/types';
import { CreateOsrivApproverSubInput } from './dto/create-osriv-approver.sub.input';
import { DB_ENTITY, SETTINGS } from '../__common__/constants';
import { UpdateOsrivInput } from './dto/update-osriv.input';
import { CommonService, WarehouseCancelResponse } from '../__common__/classes';
import { getDateRange, isAdmin, isNormalUser } from '../__common__/helpers';
import { OSRIVsResponse } from './entities/osrivs-response.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CreateOsrivItemSubInput } from './dto/create-osriv-item.sub.input';

@Injectable()
export class OsrivService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly commonService: CommonService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async create(input: CreateOsrivInput) {

        console.log('osriv create', input);

        if (!(await this.canCreate(input))) {
            throw new Error('Failed to create OSRIV. Please try again')
        }

        const osrivNumber = await this.getLatestOsrivNumber()
        const expDate = await this.commonService.getExpDate(SETTINGS.OSRIV_EXP_PERIOD_IN_DAYS)

        const data: Prisma.OSRIVCreateInput = {
            created_by: this.authUser.user.username,
            osriv_number: osrivNumber,
            date_requested: new Date(),
            exp_date: expDate,
            purpose: input.purpose,
            requested_by_id: input.requested_by_id,
            department_id: input.department_id,
            item_from: {
                connect: {
                    id: input.item_from_id
                }
            },
            osriv_approvers: {
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
            osriv_items: {
                create: input.items.map(i => {
                    return {
                        item: {connect: {id: i.item_id}},
                        quantity: i.quantity,
                        price: i.price,
                    }
                })
            }
        }

        const queries: Prisma.PrismaPromise<any>[] = []



        // create OSRIV
        const createOsrivQuery = this.prisma.oSRIV.create({ data })
        queries.push(createOsrivQuery)

        // create pending
        const createPendingQuery = this.getCreatePendingQuery(input.approvers, osrivNumber)
        queries.push(createPendingQuery)

        // update item quantity_on_queue on each item
        const updateItemQueries = this.generateUpdateItemQueries(input.items); 

        const allQueries = [...queries, ...updateItemQueries]; // combine the Prisma promises

        const result = await this.prisma.$transaction(allQueries)

        console.log('OSRIV created successfully');
        console.log('Increment quantity_on_queue on each item')
        console.log('Pending with associated approver created successfully');

        return result[0]

    }

    private generateUpdateItemQueries(items: CreateOsrivItemSubInput[]) {
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

    private getCreatePendingQuery(approvers: CreateOsrivApproverSubInput[], osrivNumber: string) {

        const firstApprover = approvers.reduce((min, obj) => {
            return obj.order < min.order ? obj : min;
        }, approvers[0]);

        const data = {
            approver_id: firstApprover.approver_id,
            reference_number: osrivNumber,
            reference_table: DB_ENTITY.OSRIV,
            description: `OSRIV no. ${osrivNumber}`
        }

        return this.prisma.pending.create({ data })

    }

    async update(id: string, input: UpdateOsrivInput) {

        const existingItem = await this.prisma.oSRIV.findUnique({
            where: { id },
            include: {
                osriv_approvers: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('OSRIV not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate(input, existingItem))) {
            throw new Error('Failed to update OSRIV. Please try again')
        }

        const data: Prisma.OSRIVUpdateInput = {
            purpose: input.purpose ?? existingItem.purpose,
            requested_by_id: input.requested_by_id ?? existingItem.requested_by_id,
            department_id: input.department_id ?? existingItem.department_id,
            item_from: input.item_from_id ? {connect: {id: input.item_from_id}} : {connect: {id: existingItem.item_from_id}},
            updated_by: this.authUser.user.username,
        }


        const result = await this.prisma.oSRIV.update({
            data,
            where: { id }
        })
        console.log('Successfully updated OSRIV');
        return result

    }

    async cancel(id: string): Promise<WarehouseCancelResponse> {

        const existingItem = await this.prisma.oSRIV.findUnique({
            where: { id },
        })

        if (!existingItem) {
            throw new NotFoundException('OSRIV not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        const queries: Prisma.PrismaPromise<any>[] = []
        
        const updateOsrivQuery = this.prisma.oSRIV.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: this.authUser.user.username,
            },
            where: { id }
        })

        queries.push(updateOsrivQuery)

        // delete all associated pendings

        const deleteAssociatedPendings = this.prisma.pending.deleteMany({
            where: {
                reference_number: existingItem.osriv_number
            }
        })

        queries.push(deleteAssociatedPendings)

        const result = await this.prisma.$transaction(queries)

        console.log('Successfully cancelled OSRIV');

        return {
            success: true,
            msg: 'Successfully cancelled OSRIV',
            cancelled_at: result[0].cancelled_at,
            cancelled_by: result[0].cancelled_by
        }

    }

    async findBy(payload: { id?: string, osriv_number?: string }): Promise<OSRIV | null> {
        const item = await this.prisma.oSRIV.findFirst({
            include: {
                osriv_items: {
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

    async findAll(page: number, pageSize: number, date_requested?: string, requested_by_id?: string): Promise<OSRIVsResponse> {
        console.log('osriv: findAll');
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
        
        whereCondition.cancelled_at = {
            equals: null,
        }

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

    async canUpdateForm(osrivId: string): Promise<Boolean> {

        if (isAdmin(this.authUser)) {
            return true
        }

        const osriv = await this.prisma.oSRIV.findUnique({
            where: {
                id: osrivId
            },
            select: {
                created_by: true,
                osriv_approvers: true
            }
        })

        const isOwner = osriv.created_by === this.authUser.user.username

        if (!isOwner) {
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

    private canAccess(item: OSRIV): boolean {

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

    private async canCreate(input: CreateOsrivInput): Promise<boolean> {

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

    private async canUpdate(input: UpdateOsrivInput, existingItem: OSRIV): Promise<boolean> {

        // validates if there is already an approver who take an action
        if (isNormalUser(this.authUser)) {

            console.log('is normal user')

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

            const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

            if (!isValidEmployeeIds) {
                throw new NotFoundException('One or more employee IDs is not valid')
            }

        }

        return true

    }

}
