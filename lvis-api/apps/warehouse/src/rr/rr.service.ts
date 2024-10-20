import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRrInput } from './dto/create-rr.input';
import { UpdateRrInput } from './dto/update-rr.input';
import { AuthUser } from '../__common__/auth-user.entity';
import { PrismaService } from '../__prisma__/prisma.service';
import { HttpService } from '@nestjs/axios';
import { Prisma, RR, RRApprover } from 'apps/warehouse/prisma/generated/client';
import { WarehouseCancelResponse } from '../__common__/classes';
import { catchError, firstValueFrom } from 'rxjs';
import { APPROVAL_STATUS } from '../__common__/types';
import { RRsResponse } from './entities/rr-response.entity';
import * as moment from 'moment';
import { getDateRange, isAdmin, isNormalUser } from '../__common__/helpers';
import { CreateRrApproverSubInput } from './dto/create-rr-approver.sub.input';
import { DB_ENTITY } from '../__common__/constants';

@Injectable()
export class RrService {

    private readonly logger = new Logger(RrService.name)
    private authUser: AuthUser
    private includedFields = {
        po: {
            include: {
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
            }
        },
        rr_items: {
            include: {
                meqs_supplier_item: {
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
        }
    }

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    // When creating rr, pendings should also be created for each approver
    async create(input: CreateRrInput): Promise<RR> {

        this.logger.log('create()')

        if (!(await this.canCreate(input))) {
            throw new Error('Failed to create RR. Please try again')
        }

        const rrNumber = await this.getLatestRrNumber()
        const today = moment().format('MM/DD/YYYY')

        // add the requisitioner as the 1st approver
        const requested_by_id = await this.getRequestedById(input.po_id)

        input.approvers.push({
            approver_id: input.received_by_id,
            label: 'Received By',
            order: 1
        })

        input.approvers.push({
            approver_id: requested_by_id,
            label: 'Confirmed By',
            order: 2
        })

        const po = await this.prisma.pO.findUnique({
            select: {
                po_number: true
            },
            where: { id: input.po_id }
        })

        if(!po) {
            throw new NotFoundException(`PO with id ${input.po_id} not found in po table`)
        }

        const data: Prisma.RRCreateInput = {
            created_by: this.authUser.user.username,
            po: { connect: { id: input.po_id } },
            po_number: po.po_number,
            rr_number: rrNumber,
            rr_date: new Date(today),
            received_by_id: input.received_by_id,
            invoice_number: input.invoice_number,
            delivery_number: input.delivery_number ?? undefined,
            notes: input.notes,
            delivery_charge: input.delivery_charge,
            rr_approvers: {
                create: input.approvers.map(i => {

                    const approver: Prisma.RRApproverCreateWithoutRrInput = {
                        approver_id: i.approver_id,
                        label: i.label,
                        order: i.order,
                        notes: '',
                        status: APPROVAL_STATUS.PENDING,
                    }

                    return approver

                })
            },
            rr_items: {
                create: input.rr_items.map(i => {

                    const item: Prisma.RRItemCreateWithoutRrInput = {
                        meqs_supplier_item: { connect: { id: i.meqs_supplier_item_id } },
                        quantity_accepted: i.quantity_accepted,
                    }

                    return item
                })
            }
        }

        const queries = []

        const createRrQuery= this.prisma.rR.create({ data })

        queries.push(createRrQuery)

        const createPendingQuery = this.getCreatePendingQuery(input.approvers, rrNumber)

        queries.push(createPendingQuery)

        const result = await this.prisma.$transaction(queries)

        console.log('RR created successfully');
        console.log('Pending with associated approver created successfully');

        return result[0]

    }

    private getCreatePendingQuery(approvers: CreateRrApproverSubInput[], rrNumber: string) {

        const firstApprover = approvers.reduce((min, obj) => {
            return obj.order < min.order ? obj : min;
        }, approvers[0]);

        const data = {
            approver_id: firstApprover.approver_id,
            reference_number: rrNumber,
            reference_table: DB_ENTITY.RR,
            description: `RR no. ${rrNumber}`
        }

        return this.prisma.pending.create({ data })

    }

    async findAll(page: number, pageSize: number, date_requested?: string, requested_by_id?: string): Promise<RRsResponse> {

        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (date_requested) {
            const { startDate, endDate } = getDateRange(date_requested);
            console.log('startDate', startDate);
            console.log('endDate', endDate)
            whereCondition.rr_date = {
                gte: startDate,
                lte: endDate,
            };
        }

        if (requested_by_id) {
            whereCondition.OR = [
                { po: { meqs_supplier: { meqs: { jo: { canvass: { requested_by_id: requested_by_id } } } } } },
                { po: { meqs_supplier: { meqs: { rv: { canvass: { requested_by_id: requested_by_id } } } } } },
                { po: { meqs_supplier: { meqs: { spr: { canvass: { requested_by_id: requested_by_id } } } } } },
            ];
        }

        // whereCondition.cancelled_at = {
        //     equals: null,
        // };

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.rR.findMany({
                include: this.includedFields,
                where: whereCondition,
                orderBy: {
                    rr_number: 'desc'
                },
                skip,
                take: pageSize
            }),
            this.prisma.rR.count({
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

    async findOne(id: string): Promise<RR | null> {
        const item = await this.prisma.rR.findUnique({
            include: {
                po: {
                    include: {
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
                    }
                },
                rr_items: {
                    include: {
                        meqs_supplier_item: {
                            include: {
                                canvass_item: {
                                    include: {
                                        unit: true,
                                        item: true
                                    }
                                }
                            }
                        },
                        item_transaction: {
                            select: {
                                item_id: true
                            }
                        }
                    }
                }
            },
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('RR not found')
        }

        return item
    }

    async findByRrNumber(rr_number: string): Promise<RR | null> {
        const item = await this.prisma.rR.findUnique({
            include: this.includedFields,
            where: { rr_number }
        })

        if (!item) {
            throw new NotFoundException('RR not found')
        }

        return item
    }

    async findByPoNumber(po_number: string): Promise<RR | null> {
        const item = await this.prisma.rR.findFirst({
            include: this.includedFields,
            where: {
                po: {
                    po_number
                }
            }
        })

        if (!item) {
            throw new NotFoundException('RR not found')
        }

        return item
    }

    async findRRsByRrNumber(rrNumber: string, includeDetails: boolean = false) {

		const trimmedRrNumber = rrNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                rr_number: true, 
            }; 
        } else {
            selectClause = { rr_number: true };
        }

        const items = await this.prisma.rR.findMany({
            select: selectClause,
            where: {
                rr_number: {
                    startsWith: trimmedRrNumber
                },
                cancelled_at: null
            },
            orderBy: {
                rr_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async getStatus(rr_id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.rRApprover.findMany({
            where: {
                rr_id,
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

    async update(id: string, input: UpdateRrInput): Promise<RR> {

        this.logger.log('update(')

        const existingItem = await this.prisma.rR.findUnique({
            where: { id }
        })

        if (!existingItem) {
            throw new NotFoundException('RR not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate(input, existingItem))) {
            throw new Error('Failed to update RR. Please try again')
        }

        const data: Prisma.RRUpdateInput = {
            received_by_id: input.received_by_id ?? existingItem.received_by_id,
            invoice_number: input.invoice_number ?? existingItem.invoice_number,
            delivery_number: input.delivery_number ?? existingItem.delivery_number,
            notes: input.notes ?? existingItem.notes,
            delivery_charge: input.delivery_charge ?? existingItem.delivery_charge,
            updated_by: this.authUser.user.username
        }

        const updated = await this.prisma.rR.update({
            data,
            where: { id },
            include: this.includedFields
        })

        this.logger.log('Successfully updated rr')

        return updated

    }

    async cancel(id: string): Promise<WarehouseCancelResponse> {

        this.logger.log('cancel()')

        const existingItem = await this.prisma.rR.findUnique({
            where: { id },
            include: {
                po: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('RR not found')
        }

        if(!existingItem.po) {
            throw new Error('RR is not associated with PO');
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        const queries: Prisma.PrismaPromise<any>[] = []

        const updateRrQuery = this.prisma.rR.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: this.authUser.user.username,
                po: {
                    disconnect: true
                }
            },
            where: { id }
        })

        queries.push(updateRrQuery)

        // delete all associated pendings

        const deleteAssociatedPendings = this.prisma.pending.deleteMany({
            where: {
                reference_number: existingItem.rr_number
            }
        })

        queries.push(deleteAssociatedPendings)

        const result = await this.prisma.$transaction(queries)

        this.logger.log('Successfully cancelled RR')

        return {
            success: true,
            msg: 'Successfully cancelled RR',
            cancelled_at: result[0].cancelled_at,
            cancelled_by: result[0].cancelled_by
        }

    }

    async canUpdateForm(rrId: string): Promise<Boolean> {

        // if (isAdmin(this.authUser)) {
        //     return true
        // }

        const rr = await this.prisma.rR.findUnique({
            where: {
                id: rrId
            },
            select: {
                created_by: true,
                rr_approvers: true
            }
        })

        const isOwner = rr.created_by === this.authUser.user.username || isAdmin(this.authUser)

        if (!isOwner) {
            return false
        }

        const hasApproval = rr.rr_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

    private async getLatestRrNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.rR.findFirst({
            where: { rr_number: { startsWith: currentYear } },
            orderBy: { rr_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.rr_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

    private async areEmployeesExist(employeeIds: string[], authUser: AuthUser): Promise<boolean> {

        this.logger.log('areEmployeesExist', employeeIds);

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

    private async canCreate(input: CreateRrInput): Promise<boolean> {

        const isValidEmployeeIds = await this.areEmployeesExist([input.received_by_id], this.authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        // get all approvers
        const approvers = await this.prisma.pOApprover.findMany({
            where: {
                po_id: input.po_id,
            }
        })

        // validate if po status is approved
        for (let approver of approvers) {

            if (approver.status !== APPROVAL_STATUS.APPROVED) {

                throw new BadRequestException('Cannot reference PO. Status is not approved')

            }

        }

        return true

    }

    private async canUpdate(input: UpdateRrInput, existingItem: RR): Promise<boolean> {

        // validates if there is already an approver who take an action
        if (isNormalUser(this.authUser)) {

            console.log('is normal user')

            const approvers = await this.prisma.rRApprover.findMany({
                where: {
                    rr_id: existingItem.id
                }
            })

            // used to indicate whether there is at least one approver whose status is not pending.
            const isAnyNonPendingApprover = this.isAnyNonPendingApprover(approvers)

            if (isAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update RR. Can only update if all approver's status is pending`)
            }
        }

        const employeeIds = []

        if (input.received_by_id) {
            employeeIds.push(input.received_by_id)
        }

        if (employeeIds.length > 0) {
            const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

            if (!isValidEmployeeIds) {
                throw new BadRequestException("One or more employee id is invalid")
            }
        }

        return true
    }

    // used to indicate whether there is at least one approver whose status is not pending.
    private isAnyNonPendingApprover(approvers: RRApprover[]): boolean {

        for (let approver of approvers) {

            if (approver.status !== APPROVAL_STATUS.PENDING) {

                return true

            }

        }

        return false

    }

    private async getRequestedById(poId: string) {

        const canvass = await this.prisma.canvass.findFirst({
            where: {
                OR: [
                    {
                        rv: {
                            meqs: {
                                meqs_suppliers: {
                                    some: {
                                        po: {
                                            id: poId
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        jo: {
                            meqs: {
                                meqs_suppliers: {
                                    some: {
                                        po: {
                                            id: poId
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        spr: {
                            meqs: {
                                meqs_suppliers: {
                                    some: {
                                        po: {
                                            id: poId
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                requested_by_id: true
            }
        });

        if (!canvass) {
            throw new NotFoundException('requested_by_id not found in canvass associate with PO ID of ' + poId)
        }

        return canvass.requested_by_id;

    }

    private canAccess(item: RR): boolean {

        if (isAdmin(this.authUser)) return true

        const isOwner = item.created_by === this.authUser.user.username

        if (isOwner) return true

        return false

    }

}
