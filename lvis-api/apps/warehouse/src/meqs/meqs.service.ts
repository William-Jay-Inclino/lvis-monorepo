import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { HttpService } from '@nestjs/axios';
import { CreateMeqsInput } from './dto/create-meqs.input';
import { MEQS, MEQSApprover, Prisma } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { UpdateMeqsInput } from './dto/update-meqs.input';
import { catchError, firstValueFrom } from 'rxjs';
import { MEQSsResponse } from './entities/meqs-response.entity';
import * as moment from 'moment';
import { getDateRange, isAdmin, isNormalUser } from '../__common__/helpers';
import { WarehouseCancelResponse } from '../__common__/classes';
import { DB_ENTITY } from '../__common__/constants';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { endOfYear, startOfYear } from 'date-fns';
import { get_pending_description, getEmployee } from '../__common__/utils';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { MeqsSupplier } from '../meqs-supplier/entities/meqs-supplier.entity';
import axios from 'axios';

@Injectable()
export class MeqsService {

    private readonly logger = new Logger(MeqsService.name);

    private includedFields = {
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
        },
        meqs_suppliers: {
            include: {
                po: {
                    include: {
                        rrs: true
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
        attachments: true,
    }

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    // When creating meqs, pendings should also be created for each approver
    async create(
        input: CreateMeqsInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<MEQS> {

        const authUser = metadata.authUser

        if (!(await this.canCreate({ input, authUser }))) {
            throw new Error('Unable to create MEQS')
        }

        let jo_number = undefined
        let rv_number = undefined
        let spr_number = undefined
        let requisitioner = undefined
        let purpose = ''

        if(input.jo_id) {
            const jo = await this.prisma.jO.findUnique({
                select: {
                    jo_number: true,
                    canvass: {
                        select: {
                            requested_by_id: true,
                            purpose: true,
                        }
                    }
                },
                where: { id: input.jo_id }
            })

            if(!jo) {
                throw new NotFoundException('JO not found with id of ' + input.jo_id)
            }

            jo_number = jo.jo_number
            purpose = jo.canvass.purpose
            requisitioner = await getEmployee(jo.canvass.requested_by_id, authUser)

        } else if(input.rv_id) {
            const rv = await this.prisma.rV.findUnique({
                select: {
                    rv_number: true,
                    canvass: {
                        select: {
                            requested_by_id: true,
                            purpose: true,
                        }
                    }
                },
                where: { id: input.rv_id }
            })

            if(!rv) {
                throw new NotFoundException('RV not found with id of ' + input.rv_id)
            }

            rv_number = rv.rv_number
            purpose = rv.canvass.purpose
            requisitioner = await getEmployee(rv.canvass.requested_by_id, authUser)


        } else if(input.spr_id) {
            const spr = await this.prisma.sPR.findUnique({
                select: {
                    spr_number: true,
                    canvass: {
                        select: {
                            requested_by_id: true,
                            purpose: true,
                        }
                    }
                },
                where: { id: input.spr_id }
            })

            if(!spr) {
                throw new NotFoundException('SPR not found with id of ' + input.spr_id)
            }

            spr_number = spr.spr_number
            purpose = spr.canvass.purpose
            requisitioner = await getEmployee(spr.canvass.requested_by_id, authUser)
        }

        const meqsNumber = await this.getLatestMeqsNumber()
        const today = moment().format('MM/DD/YYYY')

        const meqs_approvers: Prisma.MEQSApproverCreateNestedManyWithoutMeqsInput = {
            create: input.approvers.map(i => {
                return {
                    approver_id: i.approver_id,
                    label: i.label,
                    order: i.order,
                    status: APPROVAL_STATUS.PENDING,
                    notes: ''
                }
            })
        }

        const meqs_suppliers: Prisma.MEQSSupplierCreateNestedManyWithoutMeqsInput = {
            create: input.meqs_suppliers.map(supplier => {

                const supplierInput: Prisma.MEQSSupplierCreateWithoutMeqsInput = {
                    supplier: { connect: { id: supplier.supplier_id } },
                    payment_terms: supplier.payment_terms,
                    attachments: {
                        create: supplier.attachments.map(attachment => {
                            const attachmentInput: Prisma.MEQSSupplierAttachmentCreateWithoutMeqs_supplierInput = {
                                src: attachment.src,
                                filename: attachment.filename,
                            }
                            return attachmentInput
                        })
                    },
                    meqs_supplier_items: {
                        create: supplier.meqs_supplier_items.map(item => {

                            const itemInput: Prisma.MEQSSupplierItemCreateWithoutMeqs_supplierInput = {
                                price: item.price,
                                notes: item.notes,
                                vat_type: item.vat_type,
                                is_awarded: item.is_awarded,
                                canvass_item: { connect: { id: item.canvass_item_id } },
                            }

                            return itemInput
                        })
                    }
                }

                return supplierInput
            })
        }

        const data: Prisma.MEQSCreateInput = {
            created_by: authUser.user.username,
            jo: input.jo_id ? { connect: { id: input.jo_id } } : undefined,
            rv: input.rv_id ? { connect: { id: input.rv_id } } : undefined,
            spr: input.spr_id ? { connect: { id: input.spr_id } } : undefined,
            jo_number,
            spr_number,
            rv_number,
            notes: input.notes,
            meqs_notes: input.meqs_notes,
            approval_status: APPROVAL_STATUS.PENDING,
            meqs_number: meqsNumber,
            meqs_date: new Date(today),
            meqs_approvers,
            meqs_suppliers,
        }

        if(input.attachments) {
            data.attachments = {
                create: input.attachments.map(attachment => {
                    const attachmentInput: Prisma.MEQSAttachmentCreateWithoutMeqsInput = {
                        src: attachment.src,
                        filename: attachment.filename,
                    }
                    return attachmentInput
                })
            }
        }

        return await this.prisma.$transaction(async (tx) => {

            const meqs_created = await tx.mEQS.create({
                data,
                include: {
                    meqs_approvers: true,
                    meqs_suppliers: {
                        include: {
                            supplier: true,
                            attachments: true,
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

            const description = get_pending_description({
                employee: requisitioner,
                purpose,
            })
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: meqsNumber,
                reference_table: DB_ENTITY.MEQS,
                description
            }

            await tx.pending.create({ data: pendingData })

            // create audit
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.MEQS,
                action: 'CREATE-MEQS',
                reference_id: meqs_created.meqs_number,
                metadata: meqs_created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)

            return meqs_created
        });
    
    }

    async update(
        id: string, 
        input: UpdateMeqsInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<MEQS> {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.mEQS.findUnique({
            where: { id },
            include: this.includedFields
        })

        if (!existingItem) {
            throw new NotFoundException('MEQS not found')
        }

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate({ input, existingItem, authUser }))) {
            throw new Error('Unable to update MEQS')
        }

        return await this.prisma.$transaction(async (tx) => {
            const data: Prisma.MEQSUpdateInput = {
                notes: input.notes ?? existingItem.notes,
                meqs_notes: input.meqs_notes ?? existingItem.meqs_notes,
                updated_by: authUser.user.username
            };

            // Handle attachments if they're provided in the input
            if (input.attachments) {
                
                data.attachments = {
                    deleteMany: {},
                    create: input.attachments.map(attachment => ({
                        src: attachment.src,
                        filename: attachment.filename,
                    }))
                };
            }

            // Update the MEQS record
            const updated = await tx.mEQS.update({
                where: { id },
                data,
                include: this.includedFields
            });

            // Delete old files if new attachments were provided
            if (input.attachments) {
                try {
                    await this.deleteFiles(existingItem.attachments.map(attachment => attachment.src));
                } catch (error) {
                    this.logger.error(`Failed to delete old files: ${error.message}`, error.stack);
                }
            }

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.MEQS,
                action: 'UPDATE-MEQS',
                reference_id: updated.meqs_number,
                metadata: {
                    'old_value': existingItem,
                    'new_value': updated
                },
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient);

            return updated;
        });

    }

    async cancel(
        id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<WarehouseCancelResponse> {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.mEQS.findUnique({
            where: { id },
            include: {
                rv: true,
                spr: true,
                jo: true,
                meqs_suppliers: {
                    select: {
                        po: true,
                    }
                }
            }
        })

        if (!existingItem) {
            throw new NotFoundException('MEQS not found')
        }

        if(!existingItem.rv && !existingItem.spr && !existingItem.jo) {
            throw new Error('MEQS is not associated with either RV, SPR, or JO');
        }

        const isReferenceInPo = this.isReferenceInPo(existingItem.meqs_suppliers as unknown as MeqsSupplier[])

        if(isReferenceInPo) {
            throw new Error('MEQS is reference in PO')
        }

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        const data = {
            cancelled_at: new Date(),
            cancelled_by: authUser.user.username,
            approval_status: APPROVAL_STATUS.CANCELLED,
        }

        if(existingItem.rv) {
            data['rv'] = {
                disconnect: true
            }
        }

        if(existingItem.spr) {
            data['spr'] = {
                disconnect: true
            }
        }

        if(existingItem.jo) {
            data['jo'] = {
                disconnect: true
            }
        }

        return await this.prisma.$transaction(async(tx) => {

            const meqs_cancelled = await tx.mEQS.update({
                data,
                where: { id }
            })
    
            // delete associated pending
    
            const pending = await tx.pending.findUnique({
                where: {
                    reference_number_reference_table: {
                        reference_number: existingItem.meqs_number,
                        reference_table: DB_ENTITY.MEQS
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
				table: DB_TABLE.MEQS,
				action: 'CANCEL-MEQS',
				reference_id: meqs_cancelled.meqs_number,
				metadata: {
					'old_value': existingItem,
					'new_value': meqs_cancelled
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Successfully cancelled MEQS',
                cancelled_at: meqs_cancelled.cancelled_at,
                cancelled_by: meqs_cancelled.cancelled_by
            }

        })


    }

    async findAll(
        page: number, 
        pageSize: number, 
        date_requested?: string, 
        requested_by_id?: string,
        supplier_id?: string,
        approval_status?: number
    ): Promise<MEQSsResponse> {

        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (date_requested) {
            const { startDate, endDate } = getDateRange(date_requested);

            whereCondition.meqs_date = {
                gte: startDate,
                lte: endDate,
            };
        }

        if (requested_by_id) {
            whereCondition.OR = [
                { jo: { canvass: { requested_by_id: requested_by_id } } },
                { rv: { canvass: { requested_by_id: requested_by_id } } },
                { spr: { canvass: { requested_by_id: requested_by_id } } }
            ];
        }

        if (approval_status) {
            whereCondition.approval_status = approval_status;
        }

        if (supplier_id) {
            whereCondition.meqs_suppliers = {
              some: {
                supplier_id: supplier_id,
              },
            };
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
            this.prisma.mEQS.findMany({
                include: this.includedFields,
                where: whereCondition,
                orderBy: {
                    meqs_number: 'desc'
                },
                skip,
                take: pageSize,
            }),
            this.prisma.mEQS.count({
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

    async findBy(payload: { id?: string, meqs_number?: string }): Promise<MEQS | null> {

        const item = await this.prisma.mEQS.findFirst({
            where: {
                OR: [
                    { id: payload.id },
                    { meqs_number: payload.meqs_number },
                ]
            },
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
                        vehicle: true,
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
                        po: {
                            include: {
                                rrs: true
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
                attachments: true,
            }
        })

        if (!item) {
            throw new NotFoundException('MEQS not found')
        }

        return item

    }

    async findByReference(payload: {
        rv_number?: string,
        jo_number?: string,
        spr_number?: string
    }): Promise<MEQS | null> {

        const { rv_number, spr_number, jo_number } = payload
        let item = null

        if (rv_number) {
            item = await this.prisma.mEQS.findFirst({
                where: {
                    rv: { rv_number }
                },
                include: this.includedFields
            })

        } else if (jo_number) {
            item = await this.prisma.mEQS.findFirst({
                where: {
                    jo: { jo_number }
                },
                include: this.includedFields
            })
        } else {
            item = await this.prisma.mEQS.findFirst({
                where: {
                    spr: { spr_number }
                },
                include: this.includedFields
            })
        }


        if (!item) {
            throw new NotFoundException('MEQS not found')
        }

        return item
    }

    async getStatus(id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.mEQSApprover.findMany({
            where: {
                meqs_id: id,
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

    async findMeqsByMeqsNumber(meqsNumber: string, includeDetails: boolean = false) {

		const trimmedMeqsNumber = meqsNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                meqs_number: true, 
                meqs_suppliers: {
                    include: {
                        supplier: true,
                        meqs_supplier_items: {
                            include: {
                                canvass_item: {
                                    include: {
                                        unit: true
                                    }
                                }
                            }
                        }
                    }
                }
            }; 
        } else {
            selectClause = { meqs_number: true };
        }

        const items = await this.prisma.mEQS.findMany({
            select: selectClause,
            where: {
                meqs_number: {
                    startsWith: trimmedMeqsNumber
                },
                cancelled_at: null
            },
            orderBy: {
                meqs_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async forEmployeeCanceller(username: string): Promise<MEQS[]> {
        return await this.prisma.mEQS.findMany({
            where: {
                cancelled_by: username
            },
            include: this.includedFields
        })
    }

    // async isRrCompleted(meqsId: string): Promise<boolean> {

    //     const rr = await this.prisma.rR.findFirst({
    //         select: {
    //             id: true,
    //             is_completed: true
    //         },
    //         where: {
    //             po: {
    //                 meqs_supplier: {
    //                     meqs_id: meqsId
    //                 }
    //             }
    //         }
    //     })

    //     if (!rr) return false

    //     return rr.is_completed

    // }

    async canUpdateForm(payload: { meqsId: string, authUser: AuthUser }): Promise<Boolean> {

        const { meqsId, authUser } = payload

        const meqs = await this.prisma.mEQS.findUnique({
            where: {
                id: meqsId
            },
            select: {
                created_by: true,
                meqs_approvers: true
            }
        })

        const hasPermission = meqs.created_by === authUser.user.username || isAdmin(authUser);

        if (!hasPermission) {
            return false;
        }

        const hasApproval = meqs.meqs_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

    private async getLatestMeqsNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.mEQS.findFirst({
            where: { meqs_number: { startsWith: currentYear } },
            orderBy: { meqs_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.meqs_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing meqs_number with the current year prefix, start with '00001'
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

            if (data.data.validateEmployeeIds) {
                return data.data.validateEmployeeIds;
            }

            return false

        } catch (error) {
            return false;
        }
    }

    private async canReference(input: CreateMeqsInput): Promise<{ succes: boolean, msg: string }> {


        if (input.rv_id) {


            // find rv
            const rv = await this.prisma.rV.findUnique({
                where: { id: input.rv_id }
            })

            // check if rv is found
            if (!rv) {
                return { succes: false, msg: `RV not found with id: ${input.rv_id}` }
            }

            // validate if it's referenced

            const isRvReferenced = await this.prisma.mEQS.findUnique({
                where: { rv_id: rv.id }
            })

            if (isRvReferenced) {
                return { succes: false, msg: `RV is already referenced` }
            }

            // get all approvers
            const approvers = await this.prisma.rVApprover.findMany({
                where: {
                    rv_id: input.rv_id,
                }
            })

            // validate if rv status is approved
            for (let approver of approvers) {

                if (approver.status !== APPROVAL_STATUS.APPROVED) {

                    return { succes: false, msg: 'Cannot reference RV. Status is not approved' }

                }

            }

        }

        return { succes: true, msg: '' }

    }

    private async canCreate(payload: { input: CreateMeqsInput, authUser: AuthUser }): Promise<boolean> {

        const { input, authUser } = payload

        if (!input.jo_id && !input.rv_id && !input.spr_id) {
            throw new BadRequestException("Please provide 1 reference either jo, rv, or spr")
        }

        const employeeIds: string[] = input.approvers.map((input) =>
            input.approver_id
        );

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more approver id or approver proxy id is invalid")
        }

        // validates if reference id is already referenced and if status is approved
        const canReference = await this.canReference(input)

        if (!canReference.succes) {
            throw new BadRequestException(canReference.msg)
        }

        return true

    }

    private async canUpdate(payload: { input: UpdateMeqsInput, existingItem: MEQS, authUser: AuthUser }): Promise<boolean> {

        const { input, existingItem, authUser } = payload

        // validates if there is already an approver who take an action
        if (isNormalUser(authUser)) {

            const approvers = await this.prisma.mEQSApprover.findMany({
                where: {
                    meqs_id: existingItem.id
                }
            })

            // used to indicate whether there is at least one approver whose status is not pending.
            const isAnyNonPendingApprover = this.isAnyNonPendingApprover(approvers)

            if (isAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update MEQS. Can only update if all approver's status is pending`)
            }
        }

        return true

    }

    // used to indicate whether there is at least one approver whose status is not pending.
    private isAnyNonPendingApprover(approvers: MEQSApprover[]): boolean {

        for (let approver of approvers) {

            if (approver.status !== APPROVAL_STATUS.PENDING) {

                return true

            }

        }

        return false

    }

    private canAccess(payload: { item: MEQS, authUser: AuthUser }): boolean {

        const { item, authUser } = payload

        if (isAdmin(authUser)) return true

        const isOwner = item.created_by === authUser.user.username

        if (isOwner) return true

        return false

    }

    private isReferenceInPo(meqsSuppliers: MeqsSupplier[]) {

        for(let meqsSupplier of meqsSuppliers) {
            if(meqsSupplier.po) {
                return true
            }
        }

    }

    private async deleteFiles(filePaths: string[]) {

        try {

            const url = process.env.API_URL + '/api/v1/file-upload/warehouse/meqs'
            return axios.delete(url, { data: filePaths });

        } catch (error) {
            throw new Error(`Error deleting files: ${ error }`)
        }

    }

}
