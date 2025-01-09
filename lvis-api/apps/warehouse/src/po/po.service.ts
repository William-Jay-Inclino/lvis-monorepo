import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreatePoInput } from './dto/create-po.input';
import { PO, POApprover, Prisma } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS } from '../__common__/types';
import { WarehouseCancelResponse, WarehouseRemoveResponse } from '../__common__/classes';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { UpdatePoInput } from './dto/update-po.input';
import { POsResponse } from './entities/pos-response.entity';
import * as moment from 'moment';
import { getDateRange, getModule, isAdmin, isNormalUser } from '../__common__/helpers';
import { UpdatePoByFinanceManagerInput } from './dto/update-po-by-finance-manager.input';
import { DB_ENTITY } from '../__common__/constants';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { endOfYear, startOfYear } from 'date-fns';

@Injectable()
export class PoService {

    private authUser: AuthUser
    private includedFields = {
        meqs_supplier: {
            include: {
                meqs: {
                    include: {
                        rv: {
                            include: {
                                canvass: true
                            }
                        },
                        spr: {
                            include: {
                                canvass: true
                            }
                        },
                        jo: {
                            include: {
                                canvass: true
                            }
                        }
                    }
                },
                supplier: true,
                attachments: true,
                meqs_supplier_items: {
                    include: {
                        canvass_item: {
                            include: {
                                unit: true,
                                item: true
                            }
                        }
                    }
                }
            }
        },
        rrs: true
    }


    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    // When creating po, pendings should also be created for each approver
    async create(input: CreatePoInput): Promise<PO> {

        if (!(await this.canCreate(input))) {
            throw new Error('Failed to create PO. Please try again')
        }

        const poNumber = await this.getLatestPoNumber()
        const today = moment().format('MM/DD/YYYY')

        const meqsSupplier = await this.prisma.mEQSSupplier.findUnique({
            select: {
                meqs: {
                    select: {
                        meqs_number: true
                    }
                }
            },
            where: {
                id: input.meqs_supplier_id
            }
        })

        if(!meqsSupplier) {
            throw new NotFoundException(`Meqs Supplier not found with id of ${input.meqs_supplier_id}`)
        }

        const data: Prisma.POCreateInput = {
            created_by: this.authUser.user.username,
            fund_source_id: input.fund_source_id ?? null,
            po_number: poNumber,
            meqs_number: meqsSupplier.meqs.meqs_number,
            notes: input.notes,
            approval_status: APPROVAL_STATUS.PENDING,
            meqs_supplier: {
                connect: {
                    id: input.meqs_supplier_id
                }
            },
            po_date: new Date(today),
            po_approvers: {
                create: input.approvers.map(i => {

                    const approver: Prisma.POApproverCreateWithoutPoInput = {
                        approver_id: i.approver_id,
                        label: i.label,
                        order: i.order,
                        status: APPROVAL_STATUS.PENDING,
                        notes: '',
                    }

                    return approver

                })
            }
        }

        const result = await this.prisma.$transaction(async (tx) => {

            const po_created = await tx.pO.create({ data })

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const module = getModule(DB_ENTITY.PO)
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: poNumber,
                reference_table: DB_ENTITY.PO,
                description: `${ module.description } no. ${poNumber}`
            }

            await tx.pending.create({ data: pendingData })


            return po_created
        });
    
        return result;

    }

    async update(id: string, input: UpdatePoInput): Promise<PO> {

        const existingItem = await this.prisma.pO.findUnique({
            where: { id }
        })

        if (!existingItem) {
            throw new NotFoundException('PO not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate(input, existingItem))) {
            throw new Error('Failed to update PO. Please try again')
        }

        const data: Prisma.POUpdateInput = {
            notes: input.notes ?? existingItem.notes,
            fund_source_id: input.fund_source_id ?? null,
            updated_by: this.authUser.user.username
        }

        const updated = await this.prisma.pO.update({
            data,
            where: { id },
            include: this.includedFields
        })

        return updated

    }

    async cancel(id: string): Promise<WarehouseCancelResponse> {

        const existingItem = await this.prisma.pO.findUnique({
            where: { id },
            include: {
                meqs_supplier: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('PO not found')
        }

        if(!existingItem.meqs_supplier) {
            throw new Error('PO is not associated with MEQS supplier');
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        const queries: Prisma.PrismaPromise<any>[] = []
        
        const updatePoQuery = this.prisma.pO.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: this.authUser.user.username,
                approval_status: APPROVAL_STATUS.CANCELLED,
                meqs_supplier: {
                    disconnect: true
                }
            },
            where: { id }
        })

        queries.push(updatePoQuery)

        // delete all associated pendings

        const deleteAssociatedPendings = this.prisma.pending.deleteMany({
            where: {
                reference_number: existingItem.po_number
            }
        })

        queries.push(deleteAssociatedPendings)

        const result = await this.prisma.$transaction(queries)

        return {
            success: true,
            msg: 'Successfully cancelled PO',
            cancelled_at: result[0].cancelled_at,
            cancelled_by: result[0].cancelled_by
        }

    }

    async findAll(
        page: number, 
        pageSize: number, 
        date_requested?: string, 
        requested_by_id?: string, 
        approval_status?: number,
        supplier_id?: string,
    ): Promise<POsResponse> {

        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (date_requested) {
            const { startDate, endDate } = getDateRange(date_requested);
            whereCondition.po_date = {
                gte: startDate,
                lte: endDate,
            };
        }

        if (requested_by_id) {
            whereCondition.OR = [
                { meqs_supplier: { meqs: { jo: { canvass: { requested_by_id: requested_by_id } } } } },
                { meqs_supplier: { meqs: { rv: { canvass: { requested_by_id: requested_by_id } } } } },
                { meqs_supplier: { meqs: { spr: { canvass: { requested_by_id: requested_by_id } } } } }
            ];
        }
        
        if (approval_status) {
            whereCondition.approval_status = approval_status;
        }

        if (supplier_id) {
            whereCondition.meqs_supplier = {
                supplier: {
                    id: supplier_id,
                },
            };
        }

        // Default to current year's records if neither filter is provided
        if (!date_requested && !requested_by_id && !approval_status && !supplier_id) {
            const startOfYearDate = startOfYear(new Date());
            const endOfYearDate = endOfYear(new Date());

            whereCondition.created_at = {
                gte: startOfYearDate,
                lte: endOfYearDate,
            };
        }

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.pO.findMany({
                include: this.includedFields,
                where: whereCondition,
                orderBy: {
                    po_number: 'desc'
                },
                skip,
                take: pageSize,
            }),
            this.prisma.pO.count({
                where: whereCondition,
            }),
        ]);

        return {
            data: items,
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / pageSize),
        };

    }

    async findOne(id: string): Promise<PO | null> {
        const item = await this.prisma.pO.findUnique({
            include: this.includedFields,
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('PO not found')
        }

        return item
    }

    async findByPoNumber(po_number: string): Promise<PO | null> {
        const item = await this.prisma.pO.findUnique({
            include: this.includedFields,
            where: { po_number }
        })

        if (!item) {
            throw new NotFoundException('PO not found')
        }

        return item
    }

    async findByMeqsNumber(meqs_number: string): Promise<PO | null> {
        const item = await this.prisma.pO.findFirst({
            include: this.includedFields,
            where: {
                meqs_supplier: {
                    meqs: {
                        meqs_number
                    }
                }
            }
        })

        if (!item) {
            throw new NotFoundException('PO not found')
        }

        return item
    }

    async findPOsByPoNumber(poNumber: string, includeDetails: boolean = false) {

		const trimmedPoNumber = poNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                po_number: true, 
                meqs_supplier: {
                    include: {
                        supplier: true,
                        meqs_supplier_items: {
                            include: {
                                canvass_item: {
                                    include: {
                                        unit: true,
                                        item: true
                                    }
                                }
                            }
                        }
                    }
                },
                rrs: true
            }; 
        } else {
            selectClause = { po_number: true };
        }

        const items = await this.prisma.pO.findMany({
            select: selectClause,
            where: {
                po_number: {
                    startsWith: trimmedPoNumber
                },
                cancelled_at: null
            },
            orderBy: {
                po_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async getStatus(po_id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.pOApprover.findMany({
            where: {
                po_id,
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

    async updateFundSourceByFinanceManager(poId: string, payload: UpdatePoByFinanceManagerInput): Promise<WarehouseRemoveResponse> {

        if (!this.authUser.user.user_employee) {
            throw new BadRequestException('this.authUser.user.user_employee is undefined')
        }

        if (!this.authUser.user.user_employee.employee.is_finance_manager) {
            throw new ForbiddenException('Only finance manager can update')
        }

        const { fund_source_id, notes, status } = payload

        const item = await this.prisma.pO.findUnique({
            where: { id: poId }
        })

        if (!item) {
            throw new NotFoundException('PO not found with ID ' + poId)
        }

        const isValidFundSourceId = await this.isFundSourceExist(fund_source_id, this.authUser)

        if (!isValidFundSourceId) {
            throw new NotFoundException('Fund Source ID not valid')
        }

        const queries = []

        const updatePoFundSourceIdQuery = this.prisma.pO.update({
            where: { id: poId },
            data: {
                fund_source_id
            }
        })

        queries.push(updatePoFundSourceIdQuery)

        const approver_id = this.authUser.user.user_employee.employee.id

        const poApprover = await this.prisma.pOApprover.findFirst({
            where: {
                po_id: poId,
                approver_id
            }
        })

        if (!poApprover) {
            throw new NotFoundException(`PO Approver not found with po_id of ${poId} and approver_id of ${approver_id} `)
        }

        const updatePoApproverQuery = this.prisma.pOApprover.update({
            where: { id: poApprover.id },
            data: {
                notes,
                status,
                date_approval: new Date(),
            }
        })

        queries.push(updatePoApproverQuery)

        const result = await this.prisma.$transaction(queries)

        return {
            success: true,
            msg: 'Successfully updated po fund source and po approver'
        }

    }

    async canUpdateForm(poId: string): Promise<Boolean> {

        // if (isAdmin(this.authUser)) {
        //     return true
        // }

        const po = await this.prisma.pO.findUnique({
            where: {
                id: poId
            },
            select: {
                created_by: true,
                po_approvers: true
            }
        })

        const hasPermission = po.created_by === this.authUser.user.username || isAdmin(this.authUser);

        if (!hasPermission) {
            return false
        }

        const hasApproval = po.po_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

    private async getLatestPoNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.pO.findFirst({
            where: { po_number: { startsWith: currentYear } },
            orderBy: { po_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.po_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00030`;
        }
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

    private async canCreate(input: CreatePoInput): Promise<boolean> {

        if (input.fund_source_id) {
            const isValidFundSourceId = await this.isFundSourceExist(input.fund_source_id, this.authUser)

            if (!isValidFundSourceId) {
                throw new NotFoundException('Fund Source ID not valid')
            }
        }

        // VALIDATE EMPLOYEE IDS

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

    private async canUpdate(input: UpdatePoInput, existingItem: PO): Promise<boolean> {

        // validates if there is already an approver who take an action
        if (isNormalUser(this.authUser)) {

            const approvers = await this.prisma.pOApprover.findMany({
                where: {
                    po_id: existingItem.id
                }
            })

            // used to indicate whether there is at least one approver whose status is not pending.
            const isAnyNonPendingApprover = this.isAnyNonPendingApprover(approvers)

            if (isAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update PO. Can only update if all approver's status is pending`)
            }
        }

        if (input.fund_source_id) {
            const isValidFundSourceId = await this.isFundSourceExist(input.fund_source_id, this.authUser)

            if (!isValidFundSourceId) {
                throw new NotFoundException('Fund Source ID not valid')
            }
        }

        return true
    }

    // used to indicate whether there is at least one approver whose status is not pending.
    private isAnyNonPendingApprover(approvers: POApprover[]): boolean {

        for (let approver of approvers) {

            if (approver.status !== APPROVAL_STATUS.PENDING) {

                return true

            }

        }

        return false

    }

    private canAccess(item: PO): boolean {

        if (isAdmin(this.authUser)) return true

        const isOwner = item.created_by === this.authUser.user.username

        if (isOwner) return true

        return false

    }

    private async isFundSourceExist(fund_source_id: string, authUser: AuthUser): Promise<boolean> {

        const query = `
            query{
                account(id: "${fund_source_id}") {
                    id
                }
            }
        `;

        const { data } = await firstValueFrom(
            this.httpService.post(process.env.API_GATEWAY_URL,
                { query },
                {
                    headers: {
                        Authorization: authUser.authorization,
                        'Content-Type': 'application/json'
                    }
                }
            ).pipe(
                catchError((error) => {
                    throw error
                }),
            ),
        );

        if (!data || !data.data || !data.data.account) {
            return false
        }
        const account = data.data.account
        return true

    }

}
