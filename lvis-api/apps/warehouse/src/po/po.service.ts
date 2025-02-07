import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreatePoInput } from './dto/create-po.input';
import { PO, POApprover, Prisma, } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { WarehouseCancelResponse } from '../__common__/classes';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { UpdatePoInput } from './dto/update-po.input';
import { POsResponse } from './entities/pos-response.entity';
import * as moment from 'moment';
import { getDateRange, isAdmin, isNormalUser } from '../__common__/helpers';
import { DB_ENTITY } from '../__common__/constants';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { endOfYear, startOfYear } from 'date-fns';
import { MEQS } from '../meqs/entities/meq.entity';
import { get_canvass_info, get_pending_description, getEmployee } from '../__common__/utils';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@Injectable()
export class PoService {

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
        private readonly audit: WarehouseAuditService,
    ) { }

    // When creating po, pendings should also be created for each approver
    async create(
        input: CreatePoInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<PO> {

        const authUser = metadata.authUser

        if (!(await this.canCreate({ input, authUser }))) {
            throw new Error('Failed to create PO. Please try again')
        }

        const poNumber = await this.getLatestPoNumber()
        const today = moment().format('MM/DD/YYYY')

        const meqsSupplier = await this.prisma.mEQSSupplier.findUnique({
            select: {
                meqs: {
                    select: {
                        meqs_number: true,
                        rv: {
                            select: {
                                canvass: {
                                    select: {
                                        requested_by_id: true,
                                        purpose: true,
                                    }
                                }
                            }
                        },
                        spr: {
                            select: {
                                canvass: {
                                    select: {
                                        requested_by_id: true,
                                        purpose: true,
                                    }
                                }
                            }
                        },
                        jo: {
                            select: {
                                canvass: {
                                    select: {
                                        requested_by_id: true,
                                        purpose: true,
                                    }
                                }
                            }
                        }
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
            created_by: authUser.user.username,
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

        return await this.prisma.$transaction(async (tx) => {

            const po_created = await tx.pO.create({
                data,
                include: {
                    po_approvers: true,
                    meqs_supplier: {
                        include: {
                            supplier: true,
                            meqs_supplier_items: {
                                include: {
                                    canvass_item: true
                                }
                            }
                        }
                    },
                }
            })

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const { requested_by_id, purpose } = get_canvass_info({ meqs: meqsSupplier.meqs as MEQS })
            const requisitioner = await getEmployee(requested_by_id, authUser)

            const description = get_pending_description({
                employee: requisitioner,
                purpose: purpose,
            })
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: poNumber,
                reference_table: DB_ENTITY.PO,
                description
            }

            await tx.pending.create({ data: pendingData })

            // create audit
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.PO,
                action: 'CREATE-PO',
                reference_id: po_created.po_number,
                metadata: po_created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)

            return po_created
        });
    

    }

    async update(
        id: string, 
        input: UpdatePoInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<PO> {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.pO.findUnique({
            where: { id },
            include: this.includedFields
        })

        if (!existingItem) {
            throw new NotFoundException('PO not found')
        }

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate({ input, existingItem, authUser }))) {
            throw new Error('Failed to update PO. Please try again')
        }

        const data: Prisma.POUpdateInput = {
            notes: input.notes ?? existingItem.notes,
            fund_source_id: input.fund_source_id ?? null,
            updated_by: authUser.user.username
        }

        return await this.prisma.$transaction(async(tx) => {

            const updated = await this.prisma.pO.update({
                data,
                where: { id },
                include: this.includedFields
            })

            // create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.PO,
				action: 'UPDATE-PO',
				reference_id: updated.po_number,
				metadata: {
					'old_value': existingItem,
					'new_value': updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)
    
            return updated

        })


    }

    async cancel(
        id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<WarehouseCancelResponse> {

        const authUser = metadata.authUser

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

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        return await this.prisma.$transaction(async(tx) => {

            const po_cancelled = await tx.pO.update({
                data: {
                    cancelled_at: new Date(),
                    cancelled_by: authUser.user.username,
                    approval_status: APPROVAL_STATUS.CANCELLED,
                    meqs_supplier: {
                        disconnect: true
                    }
                },
                where: { id }
            })
    
            // delete associated pending
    
            const pending = await tx.pending.findUnique({
                where: {
                    reference_number_reference_table: {
                        reference_number: existingItem.po_number,
                        reference_table: DB_ENTITY.PO
                    }
                }
            })

            if(pending) {

                await tx.pending.delete({
                    where: { id: pending.id }
                })

            }

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.PO,
				action: 'CANCEL-PO',
				reference_id: po_cancelled.po_number,
				metadata: {
					'old_value': existingItem,
					'new_value': po_cancelled
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Successfully cancelled PO',
                cancelled_at: po_cancelled.cancelled_at,
                cancelled_by: po_cancelled.cancelled_by
            }

        })


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

    async findBy(payload: { id?: string, po_number?: string }): Promise<PO | null> {
        const item = await this.prisma.pO.findFirst({
            include: {
                meqs_supplier: {
                    include: {
                        meqs: {
                            include: {
                                rv: {
                                    include: {
                                        canvass: {
                                            include: {
                                                canvass_items: {
                                                    include: {
                                                        unit: true,
                                                        item: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                spr: {
                                    include: {
                                        canvass: {
                                            include: {
                                                canvass_items: {
                                                    include: {
                                                        unit: true,
                                                        item: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                jo: {
                                    include: {
                                        canvass: {
                                            include: {
                                                canvass_items: {
                                                    include: {
                                                        unit: true,
                                                        item: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                meqs_suppliers: {
                                    include: {
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
            },
            where: {
                OR: [
                    { id: payload.id },
                    { po_number: payload.po_number },
                ]
            }
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

    async canUpdateForm(payload: { poId: string, authUser: AuthUser }): Promise<Boolean> {

        const { poId, authUser } = payload

        const po = await this.prisma.pO.findUnique({
            where: {
                id: poId
            },
            select: {
                created_by: true,
                po_approvers: true
            }
        })

        const hasPermission = po.created_by === authUser.user.username || isAdmin(authUser);

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

    private async canCreate(payload: { input: CreatePoInput, authUser: AuthUser }): Promise<boolean> {

        const { input, authUser } = payload

        if (input.fund_source_id) {
            const isValidFundSourceId = await this.isFundSourceExist(input.fund_source_id, authUser)

            if (!isValidFundSourceId) {
                throw new NotFoundException('Fund Source ID not valid')
            }
        }

        // VALIDATE EMPLOYEE IDS

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

    private async canUpdate(payload: { input: UpdatePoInput, existingItem: PO, authUser: AuthUser }): Promise<boolean> {

        const { input, existingItem, authUser } = payload

        // validates if there is already an approver who take an action
        if (isNormalUser(authUser)) {

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
            const isValidFundSourceId = await this.isFundSourceExist(input.fund_source_id, authUser)

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

    private canAccess(payload: { item: PO, authUser }): boolean {

        const { item, authUser } = payload

        if (isAdmin(authUser)) return true

        const isOwner = item.created_by === authUser.user.username

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
