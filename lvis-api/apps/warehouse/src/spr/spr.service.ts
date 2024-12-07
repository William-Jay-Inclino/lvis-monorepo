import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CanvassService } from '../canvass/canvass.service';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, SPR, SPRApprover } from 'apps/warehouse/prisma/generated/client';
import { CreateSprInput } from './dto/create-spr.input';
import { APPROVAL_STATUS } from '../__common__/types';
import { UpdateSprInput } from './dto/update-spr.input';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { WarehouseCancelResponse, WarehouseRemoveResponse } from '../__common__/classes';
import { SPRsResponse } from './entities/sprs-response.entity';
import { getDateRange, getModule, isAdmin, isNormalUser } from '../__common__/helpers';
import { UpdateSprByBudgetOfficerInput } from './dto/update-spr-by-budget-officer.input';
import { DB_ENTITY } from '../__common__/constants';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { endOfYear, startOfYear } from 'date-fns';

@Injectable()
export class SprService {

    private authUser: AuthUser

    // fields that are included when returning a data from db
    private includedFields = {
        canvass: {
            include: {
                canvass_items: {
                    include: {
                        unit: true,
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
        private readonly canvassService: CanvassService
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    // When creating spr, pendings should also be created for each approver
    async create(input: CreateSprInput): Promise<SPR> {

        if (!(await this.canCreate(input))) {
            throw new Error('Failed to create SPR. Please try again')
        }

        const sprNumber = await this.getLatestSprNumber()

        const canvass = await this.prisma.canvass.findUnique({
            where: {
                id: input.canvass_id
            },
            select: {
                rc_number: true
            }
        })

        if(!canvass) {
            throw new NotFoundException(`Canvass not found with id of ${input.canvass_id}`)
        }

        const createdBy = this.authUser.user.username

        const data: Prisma.SPRCreateInput = {
            created_by: createdBy,
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

        const result = await this.prisma.$transaction(async (tx) => {

            const spr_created = await tx.sPR.create({ data })

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const module = getModule(DB_ENTITY.SPR)
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: sprNumber,
                reference_table: DB_ENTITY.SPR,
                description: `${ module.description } no. ${sprNumber}`
            }

            await tx.pending.create({ data: pendingData })


            return spr_created
        });
    
        return result;
        
    }

    async update(id: string, input: UpdateSprInput): Promise<SPR> {

        const existingItem = await this.prisma.sPR.findUnique({
            where: { id },
            include: {
                spr_approvers: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('SPR not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate(input, existingItem))) {
            throw new Error('Failed to update SPR. Please try again')
        }

        const data: Prisma.SPRUpdateInput = {
            updated_by: this.authUser.user.username,
            vehicle: input.vehicle_id ? { connect: { id: input.vehicle_id } } : { connect: { id: existingItem.vehicle_id } },
            classification_id: input.classification_id ?? null,
            notes: input.notes ?? existingItem.notes,
        }

        const queries = []

        const updateSprQuery = this.prisma.sPR.update({
            data,
            where: { id },
            include: this.includedFields
        })

        queries.push(updateSprQuery)

        // if supervisor is updated
        if(input.supervisor_id) {

            const existing_supervisor_id = await this.get_supervisor_id(id)

            if(existing_supervisor_id !== input.supervisor_id) {

                // update supervisor in rv approver

                const update_spr_approver_query = this.prisma.sPRApprover.update({
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

                queries.push(update_spr_approver_query)


                // ================ UPDATE PENDINGS ================
    
                // check first if existing supervisor is in pendings table
                const pending_existing_supervisor = await this.prisma.pending.findUnique({
                    where: {
                        approver_id_reference_number_reference_table: {
                            approver_id: existing_supervisor_id,
                            reference_number: existingItem.spr_number,
                            reference_table: DB_ENTITY.SPR,
                        }
                    }
                })

                // remove pending approval of previous supervisor
                if(pending_existing_supervisor) {
                    const removePendingQuery = this.prisma.pending.delete({
                        where: { id: pending_existing_supervisor.id }
                    })

                    queries.push(removePendingQuery)
                }

                
                // check first if new supervisor is in pendings table
                const pending_new_supervisor = await this.prisma.pending.findUnique({
                    where: {
                        approver_id_reference_number_reference_table: {
                            approver_id: input.supervisor_id,
                            reference_number: existingItem.spr_number,
                            reference_table: DB_ENTITY.SPR,
                        }
                    }
                })

                // create pending approval of new supervisor
                if(!pending_new_supervisor) {
                    const module = getModule(DB_ENTITY.SPR)
                    const createPendingQuery = this.prisma.pending.create({
                        data: {
                            approver_id: input.supervisor_id,
                            reference_number: existingItem.spr_number,
                            reference_table: DB_ENTITY.SPR,
                            description: `${ module.description } no. ${existingItem.spr_number}`
                        }
                    })
        
                    queries.push(createPendingQuery)

                }


            }


        }

        const result = await this.prisma.$transaction(queries)

        return result[0]

    }

    async cancel(id: string): Promise<WarehouseCancelResponse> {

        const existingItem = await this.prisma.sPR.findUnique({
            where: { id },
            include: {
                canvass: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('SPR not found')
        }

        if (!existingItem.canvass) {
            throw new Error('SPR is not associated with a Canvass');
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        const queries: Prisma.PrismaPromise<any>[] = []
        
        const updateSprQuery = this.prisma.sPR.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: this.authUser.user.username,
                approval_status: APPROVAL_STATUS.CANCELLED,
                canvass: {
                    disconnect: true
                }
            },
            where: { id }
        })

        queries.push(updateSprQuery)

        // delete all associated pendings

        const deleteAssociatedPendings = this.prisma.pending.deleteMany({
            where: {
                reference_number: existingItem.spr_number
            }
        })

        queries.push(deleteAssociatedPendings)

        const result = await this.prisma.$transaction(queries)

        return {
            success: true,
            msg: 'Successfully cancelled SPR',
            cancelled_at: result[0].cancelled_at,
            cancelled_by: result[0].cancelled_by
        }

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

    async updateClassificationByBudgetOfficer(sprId: string, payload: UpdateSprByBudgetOfficerInput): Promise<WarehouseRemoveResponse> {

        if (!this.authUser.user.user_employee) {
            throw new BadRequestException('this.authUser.user.user_employee is undefined')
        }

        if (!this.authUser.user.user_employee.employee.is_budget_officer) {
            throw new ForbiddenException('Only budget officer can update')
        }

        const { classification_id, notes, status } = payload

        const item = await this.prisma.sPR.findUnique({
            where: { id: sprId }
        })

        if (!item) {
            throw new NotFoundException('SPR not found with ID ' + sprId)
        }

        const isValidClassificationId = await this.isClassificationExist(classification_id, this.authUser)

        if (!isValidClassificationId) {
            throw new NotFoundException('Classification ID not valid')
        }

        const queries = []

        const updateSprClassificationIdQuery = this.prisma.sPR.update({
            where: { id: sprId },
            data: {
                classification_id
            }
        })

        queries.push(updateSprClassificationIdQuery)

        const approver_id = this.authUser.user.user_employee.employee.id

        const sprApprover = await this.prisma.sPRApprover.findFirst({
            where: {
                spr_id: sprId,
                approver_id
            }
        })

        if (!sprApprover) {
            throw new NotFoundException(`SPR Approver not found with spr_id of ${sprId} and approver_id of ${approver_id} `)
        }

        const updateSprApproverQuery = this.prisma.sPRApprover.update({
            where: { id: sprApprover.id },
            data: {
                notes,
                status,
                date_approval: new Date(),
            }
        })

        queries.push(updateSprApproverQuery)

        const result = await this.prisma.$transaction(queries)

        return {
            success: true,
            msg: 'Successfully updated spr classification and spr approver'
        }

    }

    async canUpdateForm(sprId: string): Promise<Boolean> {

        // if (isAdmin(this.authUser)) {
        //     return true
        // }

        const spr = await this.prisma.sPR.findUnique({
            where: {
                id: sprId
            },
            select: {
                created_by: true,
                spr_approvers: true
            }
        })

        const isOwner = spr.created_by === this.authUser.user.username || isAdmin(this.authUser)

        if (!isOwner) {
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
            return `${currentYear}-00001`;
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

    private async canCreate(input: CreateSprInput): Promise<boolean> {

        if (input.classification_id) {
            const isValidClassificationId = await this.isClassificationExist(input.classification_id, this.authUser)

            if (!isValidClassificationId) {
                throw new NotFoundException('Classification ID not valid')
            }
        }

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

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

    private async canUpdate(input: UpdateSprInput, existingItem: SPR): Promise<boolean> {

        // validates if there is already an approver who take an action
        if (isNormalUser(this.authUser)) {

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
            const isValidClassificationId = await this.isClassificationExist(input.classification_id, this.authUser)

            if (!isValidClassificationId) {
                throw new NotFoundException('Classification ID not valid')
            }
        }

        const employeeIds = []

        if (input.supervisor_id) {
            employeeIds.push(input.supervisor_id)
        }

        if (employeeIds.length > 0) {

            const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

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

    private canAccess(item: SPR): boolean {

        if (isAdmin(this.authUser)) return true

        const isOwner = item.created_by === this.authUser.user.username

        if (isOwner) return true

        return false

    }

}
