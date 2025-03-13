import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CanvassService } from '../canvass/canvass.service';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, SPR, SPRApprover } from 'apps/warehouse/prisma/generated/client';
import { CreateSprInput } from './dto/create-spr.input';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { UpdateSprInput } from './dto/update-spr.input';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { WarehouseCancelResponse } from '../__common__/classes';
import { SPRsResponse } from './entities/sprs-response.entity';
import { getDateRange, isAdmin, isNormalUser } from '../__common__/helpers';
import { DB_ENTITY } from '../__common__/constants';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { endOfYear, startOfYear } from 'date-fns';
import { get_pending_description, getEmployee } from '../__common__/utils';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@Injectable()
export class SprService {

    private includedFields = {
        canvass: {
            include: {
                canvass_items: {
                    include: {
                        unit: true,
                        item: true
                    }
                }
            }
        },
        meqs: {
            include: {
                meqs_suppliers: {
                    include: {
                        po: {
                            include: {
                                rrs: true
                            }
                        }
                    }
                }
            }
        },
        vehicle: true
    }

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly canvassService: CanvassService,
        private readonly audit: WarehouseAuditService,
    ) { }


    async create(
        input: CreateSprInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<SPR> {

        const authUser = metadata.authUser

        if (!(await this.canCreate({ input, authUser }))) {
            throw new Error('Failed to create SPR. Please try again')
        }

        const sprNumber = await this.getLatestSprNumber()

        const canvass = await this.prisma.canvass.findUnique({
            where: {
                id: input.canvass_id
            },
            select: {
                rc_number: true,
                requested_by_id: true,
                purpose: true,
            }
        })

        if(!canvass) {
            throw new NotFoundException(`Canvass not found with id of ${input.canvass_id}`)
        }

        const data: Prisma.SPRCreateInput = {
            created_by: authUser.user.username,
            spr_number: sprNumber,
            canvass_number: canvass.rc_number,
            date_requested: new Date(),
            classification_id: input.classification_id ?? null,
            notes: input.notes ?? null,
            canvass: { connect: { id: input.canvass_id } },
            vehicle: { connect: { id: input.vehicle_id } },
            approval_status: APPROVAL_STATUS.PENDING,
            spr_approvers: {
                create: input.approvers.map(i => {
                    return {
                        approver_id: i.approver_id,
                        label: i.label,
                        order: i.order,
                        notes: '',
                        status: APPROVAL_STATUS.PENDING,
                    }
                })
            }
        }

        return await this.prisma.$transaction(async (tx) => {

            const spr_created = await tx.sPR.create({
                data,
                include: {
                    spr_approvers: true,
                }
            })

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const requisitioner = await getEmployee(canvass.requested_by_id, authUser)

            const description = get_pending_description({
                employee: requisitioner,
                purpose: canvass.purpose,
            })
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: sprNumber,
                reference_table: DB_ENTITY.SPR,
                description
            }

            await tx.pending.create({ data: pendingData })

            // create audit
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.SPR,
                action: 'CREATE-SPR',
                reference_id: spr_created.spr_number,
                metadata: spr_created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)

            return spr_created
        });
    
    }

    async update(
        id: string, 
        input: UpdateSprInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.sPR.findUnique({
            where: { id },
            include: {
                spr_approvers: true,
                canvass: {
                    select: {
                        requested_by_id: true,
                        purpose: true,
                    }
                }
            }
        })

        if (!existingItem) {
            throw new NotFoundException('SPR not found')
        }

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate({ input, existingItem, authUser }))) {
            throw new Error('Failed to update SPR. Please try again')
        }

        const data: Prisma.SPRUpdateInput = {
            updated_by: authUser.user.username,
            vehicle: input.vehicle_id ? { connect: { id: input.vehicle_id } } : { connect: { id: existingItem.vehicle_id } },
            classification_id: input.classification_id ?? null,
            notes: input.notes ?? existingItem.notes,
        }

        return await this.prisma.$transaction(async(tx) => {

            const spr_updated = await tx.sPR.update({
                data,
                where: { id },
                include: {
                    spr_approvers: true,
                    canvass: {
                        select: {
                            requested_by_id: true,
                            purpose: true,
                        }
                    }
                }
            })
    
            // if supervisor is updated
            if(input.supervisor_id) {
    
                const existing_supervisor_id = await this.get_supervisor_id(id)
    
                if(existing_supervisor_id !== input.supervisor_id) {
    
                    // update supervisor in rv approver
    
                    await tx.sPRApprover.update({
                        where: {
                            spr_id_order: {
                                spr_id: id,
                                order: 1,
                            },
                        },
                        data: {
                            approver_id: input.supervisor_id,
                        }
                    })
    
                    // ================ UPDATE PENDINGS ================
        
                    // check first if existing supervisor is in pendings table
                    const pending_existing_supervisor = await tx.pending.findUnique({
                        where: {
                            reference_number_reference_table: {
                                reference_number: existingItem.spr_number,
                                reference_table: DB_ENTITY.SPR,
                            }
                        }
                    })
    
                    // remove pending approval of previous supervisor
                    if(pending_existing_supervisor) {
                        
                        await tx.pending.delete({
                            where: { id: pending_existing_supervisor.id }
                        })

                        await tx.pending.create({
                            data: {
                                approver_id: input.supervisor_id,
                                reference_number: pending_existing_supervisor.reference_number,
                                reference_table: pending_existing_supervisor.reference_table,
                                description: pending_existing_supervisor.description,
                            }
                        })
                    }
                }
    
            }

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.SPR,
				action: 'UPDATE-SPR',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': spr_updated.spr_number
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as Prisma.TransactionClient)

            return spr_updated

        })

    }

    async cancel(
        id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<WarehouseCancelResponse> {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.sPR.findUnique({
            where: { id },
            include: {
                canvass: true,
                meqs: true,
            }
        })

        if (!existingItem) {
            throw new NotFoundException('SPR not found')
        }

        if (!existingItem.canvass) {
            throw new Error('SPR is not associated with a Canvass');
        }

        if(existingItem.meqs) {
            throw new Error('SPR is reference by MEQS');
        }

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        return await this.prisma.$transaction(async(tx) => {

            const spr_cancelled = await tx.sPR.update({
                data: {
                    cancelled_at: new Date(),
                    cancelled_by: authUser.user.username,
                    approval_status: APPROVAL_STATUS.CANCELLED,
                    canvass: {
                        disconnect: true
                    }
                },
                where: { id }
            })
    
            // delete associated pending
            
            const pending = await tx.pending.findUnique({
                where: {
                    reference_number_reference_table: {
                        reference_number: existingItem.spr_number,
                        reference_table: DB_ENTITY.SPR
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
				table: DB_TABLE.SPR,
				action: 'CANCEL-SPR',
				reference_id: spr_cancelled.spr_number,
				metadata: {
					'old_value': existingItem,
					'new_value': spr_cancelled
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Successfully cancelled SPR',
                cancelled_at: spr_cancelled.cancelled_at,
                cancelled_by: spr_cancelled.cancelled_by
            }

        })

    }

    async findOne(id: string): Promise<SPR | null> {
        const item = await this.prisma.sPR.findUnique({
            include: this.includedFields,
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('SPR not found')
        }

        return item
    }

    async findByRcNumber(rc_number: string): Promise<SPR | null> {
        const item = await this.prisma.sPR.findFirst({
            include: this.includedFields,
            where: {
                canvass: {
                    rc_number
                }
            }
        })

        if (!item) {
            throw new NotFoundException('SPR not found')
        }

        return item
    }

    async findBySprNumber(spr_number: string): Promise<SPR | null> {
        const item = await this.prisma.sPR.findUnique({
            include: this.includedFields,
            where: { spr_number }
        })

        if (!item) {
            throw new NotFoundException('SPR not found')
        }

        return item
    }

    async findAll(page: number, pageSize: number, date_requested?: string, requested_by_id?: string, approval_status?: number): Promise<SPRsResponse> {
        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (date_requested) {
            const { startDate, endDate } = getDateRange(date_requested);

            whereCondition.date_requested = {
                gte: startDate,
                lte: endDate,
            };
        }

        if (requested_by_id) {
            whereCondition = { ...whereCondition, canvass: { requested_by_id: requested_by_id } }
        }

        if (approval_status) {
            whereCondition.approval_status = approval_status;
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
        
        // whereCondition.cancelled_at = {
        //     equals: null,
        // }

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.sPR.findMany({
                include: this.includedFields,
                where: whereCondition,
                orderBy: {
                    spr_number: 'desc'
                },
                skip,
                take: pageSize,
            }),
            this.prisma.sPR.count({
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

    async findSprsBySprNumber(sprNumber: string, includeDetails: boolean = false) {

		const trimmedSprNumber = sprNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                spr_number: true, 
                canvass: {
                    include: {
                        canvass_items: {
                            include: {
                                unit: true,
                            }
                        }
                    }
                }
            }; 
        } else {
            selectClause = { spr_number: true };
        }

        const items = await this.prisma.sPR.findMany({
            select: selectClause,
            where: {
                spr_number: {
                    startsWith: trimmedSprNumber
                },
                cancelled_at: null
            },
            orderBy: {
                spr_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async getStatus(id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.sPRApprover.findMany({
            where: {
                spr_id: id,
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

    async isReferenced(sprId: string): Promise<Boolean> {

        const meqs = await this.prisma.mEQS.findUnique({
            where: { spr_id: sprId }
        })

        if (meqs) return true

        return false

    }

    async canUpdateForm(payload: { sprId: string, authUser: AuthUser }): Promise<Boolean> {

        const { sprId, authUser } = payload

        const spr = await this.prisma.sPR.findUnique({
            where: {
                id: sprId
            },
            select: {
                created_by: true,
                spr_approvers: true
            }
        })

        const hasPermission = spr.created_by === authUser.user.username || isAdmin(authUser);

        if (!hasPermission) {
            return false
        }

        const hasApproval = spr.spr_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

    async get_supervisor_id(spr_id: string): Promise<string> {
        const supervisor = await this.prisma.sPRApprover.findUnique({
            where: {
                spr_id_order: {
                    spr_id,
                    order: 1
                }
            }
        })

        if(!supervisor) {
            throw new NotFoundException("Supervisor not found with spr_id of " + spr_id + " and order of 1")
        }

        return supervisor.approver_id
    }

    private async getLatestSprNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.sPR.findFirst({
            where: { spr_number: { startsWith: currentYear } },
            orderBy: { spr_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.spr_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00030`;
        }
    }

    private async isClassificationExist(classification_id: string, authUser: AuthUser): Promise<boolean> {

        const query = `
            query{
                classification(id: "${classification_id}") {
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


        if (!data || !data.data || !data.data.classification) {
            return false
        }
        const classification = data.data.classification
        return true

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

    private async canCreate(payload: { input: CreateSprInput, authUser: AuthUser }): Promise<boolean> {

        const { input, authUser } = payload

        if (input.classification_id) {
            const isValidClassificationId = await this.isClassificationExist(input.classification_id, authUser)

            if (!isValidClassificationId) {
                throw new NotFoundException('Classification ID not valid')
            }
        }

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        const canvass = await this.prisma.canvass.findUnique({
            where: { id: input.canvass_id }
        })

        if (!canvass) {
            throw new NotFoundException('Canvass not found with id: ' + input.canvass_id)
        }

        const isCanvassReferenced = await this.canvassService.isReferenced((canvass.id))

        if (isCanvassReferenced) {
            throw new BadRequestException('Canvass already been referenced with ID: ' + input.canvass_id)
        }

        return true

    }

    private async canUpdate(payload: { input: UpdateSprInput, existingItem: SPR, authUser }): Promise<boolean> {

        const { input, existingItem, authUser } = payload

        // validates if there is already an approver who take an action
        if (isNormalUser(authUser)) {

            const approvers = await this.prisma.sPRApprover.findMany({
                where: {
                    spr_id: existingItem.id
                }
            })

            // used to indicate whether there is at least one approver whose status is not pending.
            const isAnyNonPendingApprover = this.isAnyNonPendingApprover(approvers)

            if (isAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update SPR. Can only update if all approver's status is pending`)
            }
        }

        if (input.classification_id) {
            const isValidClassificationId = await this.isClassificationExist(input.classification_id, authUser)

            if (!isValidClassificationId) {
                throw new NotFoundException('Classification ID not valid')
            }
        }

        const employeeIds = []

        if (input.supervisor_id) {
            employeeIds.push(input.supervisor_id)
        }

        if (employeeIds.length > 0) {

            const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, authUser)

            if (!isValidEmployeeIds) {
                throw new NotFoundException('One or more employee IDs is not valid')
            }

        }

        return true

    }

    // used to indicate whether there is at least one approver whose status is not pending.
    private isAnyNonPendingApprover(approvers: SPRApprover[]): boolean {

        for (let approver of approvers) {

            if (approver.status !== APPROVAL_STATUS.PENDING) {

                return true

            }

        }

        return false

    }

    private canAccess(payload: { item: SPR, authUser: AuthUser }): boolean {

        const { item, authUser } = payload

        if (isAdmin(authUser)) return true

        const isOwner = item.created_by === authUser.user.username

        if (isOwner) return true

        return false

    }

}
