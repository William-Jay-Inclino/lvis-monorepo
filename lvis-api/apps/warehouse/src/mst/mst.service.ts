import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMstInput } from './dto/create-mst.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { MST, Prisma } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { DB_ENTITY } from '../__common__/constants';
import { UpdateMstInput } from './dto/update-mst.input';
import { WarehouseCancelResponse } from '../__common__/classes';
import { getDateRange, getModule, isAdmin, isNormalUser } from '../__common__/helpers';
import { MSTsResponse } from './entities/msts-response.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { endOfYear, startOfYear } from 'date-fns';
import { get_pending_description, getEmployee } from '../__common__/utils';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@Injectable()
export class MstService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async create(
        input: CreateMstInput, 
		metadata: { ip_address: string, device_info: any }
    ) {

        if (!(await this.canCreate(input))) {
            throw new Error('Failed to create MST. Please try again')
        }

        const mstNumber = await this.getLatestMstNumber()

        const data: Prisma.MSTCreateInput = {
            created_by: this.authUser.user.username,
            mst_number: mstNumber,
            mst_date: new Date(),
            returned_by_id: input.returned_by_id,
            cwo_number: input.cwo_number,
            mwo_number: input.mwo_number,
            jo_number: input.jo_number,
            remarks: input.remarks,
            approval_status: APPROVAL_STATUS.PENDING,
            mst_approvers: {
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
            mst_items: {
                create: input.items.map(i => {
                    return {
                        item: {connect: {id: i.item_id}},
                        quantity: i.quantity,
                        price: i.price,
                        status: i.status,
                    }
                })
            }
        }

        return await this.prisma.$transaction(async (tx) => {

            const mst_created = await tx.mST.create({
                data,
                include: {
                    mst_approvers: true,
                    mst_items: true,
                }
            })

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const returned_by = await getEmployee(mst_created.returned_by_id, this.authUser)
            
            const description = get_pending_description({
                employee: returned_by,
                purpose: mst_created.remarks,
                label: 'Returned by',
                desc_label: 'Remarks'
            })
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: mstNumber,
                reference_table: DB_ENTITY.MST,
                description 
            }

            await tx.pending.create({ data: pendingData })

            await this.audit.createAuditEntry({
                username: this.authUser.user.username,
                table: DB_TABLE.MST,
                action: 'CREATE-MST',
                reference_id: mst_created.mst_number,
                metadata: mst_created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)

            return mst_created
        });
    

    }

    async update(
        id: string, 
        input: UpdateMstInput, 
		metadata: { ip_address: string, device_info: any }
    ) {

        const existingItem = await this.prisma.mST.findUnique({
            where: { id },
        })

        if (!existingItem) {
            throw new NotFoundException('MST not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

        if (!(await this.canUpdate(input, existingItem))) {
            throw new Error('Failed to update MST. Please try again')
        }

        const data: Prisma.MSTUpdateInput = {

            remarks: input.remarks ?? existingItem.remarks,

            cwo_number: input.cwo_number ?? existingItem.cwo_number,
            mwo_number: input.mwo_number ?? existingItem.mwo_number,
            jo_number: input.jo_number ?? existingItem.jo_number,

            returned_by_id: input.returned_by_id ?? existingItem.returned_by_id,

            updated_by: this.authUser.user.username,
        }


        return await this.prisma.$transaction(async(tx) => {

            const mst_updated = await tx.mST.update({
                data,
                where: { id }
            })

            const pending = await tx.pending.findFirst({
                where: {
                    reference_number: mst_updated.mst_number,
                    reference_table: DB_ENTITY.MST,
                }
            })

            if(pending) {

                const returned_by = await getEmployee(mst_updated.returned_by_id, this.authUser)
            
                const description = get_pending_description({
                    employee: returned_by,
                    purpose: mst_updated.remarks,
                    label: 'Returned by',
                    desc_label: 'Remarks'
                })

                await tx.pending.update({
                    where: {
                        id: pending.id
                    },
                    data: {
                        description
                    }
                })
            }

            await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.MST,
				action: 'UPDATE-MST',
				reference_id: mst_updated.mst_number,
				metadata: {
					'old_value': existingItem,
					'new_value': mst_updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)
            
            return mst_updated

        })

    }

    async cancel(
        id: string, 
		metadata: { ip_address: string, device_info: any }
    ): Promise<WarehouseCancelResponse> {

        const existingItem = await this.prisma.mST.findUnique({
            where: { id },
        })

        if (!existingItem) {
            throw new NotFoundException('MST not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        return await this.prisma.$transaction(async(tx) => {

            const mst_cancelled = await tx.mST.update({
                data: {
                    cancelled_at: new Date(),
                    cancelled_by: this.authUser.user.username,
                    approval_status: APPROVAL_STATUS.CANCELLED,
                },
                where: { id }
            })
    
            // delete associated pending
    
            const pending = await tx.pending.findUnique({
                where: {
                    reference_number_reference_table: {
                        reference_number: existingItem.mst_number,
                        reference_table: DB_ENTITY.MST
                    }
                }
            })

            if(pending) {

                await tx.pending.delete({
                    where: { id: pending.id }
                })

            }

            await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.MST,
				action: 'CANCEL-MST',
				reference_id: mst_cancelled.mst_number,
				metadata: {
					'old_value': existingItem,
					'new_value': mst_cancelled
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Successfully cancelled MST',
                cancelled_at: mst_cancelled.cancelled_at,
                cancelled_by: mst_cancelled.cancelled_by
            }

        })


    }

    async findBy(payload: { id?: string, mst_number?: string }): Promise<MST | null> {
        const item = await this.prisma.mST.findFirst({
            include: {
                mst_items: {
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
            },
            where: {
                OR: [
                    { id: payload.id },
                    { mst_number: payload.mst_number }
                ]
            }
        });
    
        if (!item) {
            throw new NotFoundException('MST not found');
        }
    
        return item;
    }

    async findAll(page: number, pageSize: number, date_requested?: string, returned_by_id?: string, approval_status?: number): Promise<MSTsResponse> {
        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (date_requested) {
            const { startDate, endDate } = getDateRange(date_requested);

            whereCondition.mst_date = {
                gte: startDate,
                lte: endDate,
            };

        }

        if (returned_by_id) {
            whereCondition = { ...whereCondition, returned_by_id }
        }

        if (approval_status) {
            whereCondition.approval_status = approval_status;
        }

        // Default to current year's records if neither filter is provided
        if (!date_requested && !returned_by_id && !approval_status) {
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
            this.prisma.mST.findMany({
                where: whereCondition,
                orderBy: {
                    mst_number: 'desc'
                },
                skip,
                take: pageSize,
            }),
            this.prisma.mST.count({
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

    async findMstsByMstNumber(mstNumber: string, includeDetails: boolean = false) {

		const trimmedMstNumber = mstNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                mst_number: true, 
            }; 
        } else {
            selectClause = { mst_number: true };
        }

        const items = await this.prisma.mST.findMany({
            select: selectClause,
            where: {
                mst_number: {
                    startsWith: trimmedMstNumber
                },
                cancelled_at: null
            },
            orderBy: {
                mst_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async getStatus(id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.mSTApprover.findMany({
            where: {
                mst_id: id,
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

    async canUpdateForm(mstId: string): Promise<Boolean> {

        // if (isAdmin(this.authUser)) {
        //     return true
        // }

        const mst = await this.prisma.mST.findUnique({
            where: {
                id: mstId
            },
            select: {
                created_by: true,
                mst_approvers: true
            }
        })

        const hasPermission = mst.created_by === this.authUser.user.username || isAdmin(this.authUser);

        if (!hasPermission) {
            return false
        }

        const hasApproval = mst.mst_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

    private async getLatestMstNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.mST.findFirst({
            where: { mst_number: { startsWith: currentYear } },
            orderBy: { mst_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.mst_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

    private canAccess(item: MST): boolean {

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

    private async canCreate(input: CreateMstInput): Promise<boolean> {

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        if(input.returned_by_id) {
            employeeIds.push(input.returned_by_id)
        }

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

    private async canUpdate(input: UpdateMstInput, existingItem: MST): Promise<boolean> {

        // validates if there is already an approver who take an action
        if (isNormalUser(this.authUser)) {

            const approvers = await this.prisma.mSTApprover.findMany({
                where: {
                    mst_id: existingItem.id
                }
            })

            const hasAnyNonPendingApprover = approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

            if (hasAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update MST. Can only update if all approver's status is pending`)
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
