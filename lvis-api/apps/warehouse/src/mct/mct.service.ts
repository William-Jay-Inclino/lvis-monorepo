import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMctInput } from './dto/create-mct.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { MCT, Prisma } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { DB_ENTITY } from '../__common__/constants';
import { UpdateMctInput } from './dto/update-mct.input';
import { WarehouseCancelResponse } from '../__common__/classes';
import { getDateRange, getModule, isAdmin} from '../__common__/helpers';
import { MCTsResponse } from './entities/mcts-response.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { endOfYear, startOfYear } from 'date-fns';
import { get_pending_description, getEmployee } from '../__common__/utils';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@Injectable()
export class MctService {

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
        input: CreateMctInput, 
		metadata: { ip_address: string, device_info: any }
    ) {

        if (!(await this.canCreate(input))) {
            throw new Error('Failed to create MCT. Please try again')
        }

        const mrv = await this.prisma.mRV.findUnique({
            select: {
                mrv_number: true
            },
            where: { id: input.mrv_id }
        })

        if(!mrv) {
            throw new NotFoundException(`MRV with id ${input.mrv_id} not found in mrv table`)
        }

        const mctNumber = await this.getLatestMctNumber()

        const data: Prisma.MCTCreateInput = {
            created_by: this.authUser.user.username,
            mct_number: mctNumber,
            mrv_number: mrv.mrv_number,
            mct_date: new Date(),
            mrv: { connect: { id: input.mrv_id } },
            approval_status: APPROVAL_STATUS.PENDING,
            mct_approvers: {
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
        }

        return await this.prisma.$transaction(async (tx) => {

            const mct_created = await tx.mCT.create({
                data,
                include: {
                    mrv: {
                        select: {
                            requested_by_id: true,
                            purpose: true,
                        }
                    },
                    mct_approvers: true,
                }
            })

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const requisitioner = await getEmployee(mct_created.mrv.requested_by_id, this.authUser)
            
            const description = get_pending_description({
                employee: requisitioner,
                purpose: mct_created.mrv.purpose,
            })
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: mctNumber,
                reference_table: DB_ENTITY.MCT,
                description
            }

            await tx.pending.create({ data: pendingData })

            await this.audit.createAuditEntry({
                username: this.authUser.user.username,
                table: DB_TABLE.MCT,
                action: 'CREATE-MCT',
                reference_id: mct_created.mct_number,
                metadata: mct_created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)

            return mct_created
        });
    
    }

    async cancel(
        id: string, 
		metadata: { ip_address: string, device_info: any }
    ): Promise<WarehouseCancelResponse> {

        const existingItem = await this.prisma.mCT.findUnique({
            include: {
                mrv: {
                    include: {
                        mrv_items: true,
                    }
                }
            },
            where: { id },
        })

        if (!existingItem) {
            throw new NotFoundException('MCT not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        return await this.prisma.$transaction(async(tx) => {

            const mct_cancelled = await tx.mCT.update({
                data: {
                    cancelled_at: new Date(),
                    cancelled_by: this.authUser.user.username,
                    approval_status: APPROVAL_STATUS.CANCELLED,
                    mrv: {
                        disconnect: true
                    }
                },
                where: { id }
            })
    
            // delete associated pending
    
            const pending = await tx.pending.findUnique({
                where: {
                    reference_number_reference_table: {
                        reference_number: existingItem.mct_number,
                        reference_table: DB_ENTITY.MCT
                    }
                }
            })

            if(pending) {

                await tx.pending.delete({
                    where: { id: pending.id }
                })

            }
    
            // update item qty (decrement based on mrv items qty) 
    
            for(let mrvItem of existingItem.mrv.mrv_items) {
    
                await tx.item.update({
                    where: { id: mrvItem.item_id },
                    data: {
                        quantity_on_queue: {
                            decrement: mrvItem.quantity
                        }
                    }
                })
    
            }

            await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.MCT,
				action: 'CANCEL-MCT',
				reference_id: mct_cancelled.mct_number,
				metadata: {
					'old_value': existingItem,
					'new_value': mct_cancelled
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Successfully cancelled MCT',
                cancelled_at: mct_cancelled.cancelled_at,
                cancelled_by: mct_cancelled.cancelled_by
            }

        })


    }

    async findBy(payload: { id?: string, mct_number?: string }): Promise<MCT | null> {
        const item = await this.prisma.mCT.findFirst({
            include: {
                mcrts: true,
                mrv: {
                    include: {
                        mrv_items: {
                            include: {
                                item: {
                                    include: {
                                        unit: true,
                                        item_transactions: true,
                                        item_type: true,
                                        project_item: {
                                            include: {
                                                project: true,
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        item_from: true,
                        project: true,
                        mct: true,
                    }
                }
            },
            where: {
                OR: [
                    { id: payload.id },
                    { mct_number: payload.mct_number }
                ]
            }
        });
    
        if (!item) {
            throw new NotFoundException('MCT not found');
        }
    
        return item;
    }

    async findAll(page: number, pageSize: number, date_requested?: string, requested_by_id?: string, approval_status?: number): Promise<MCTsResponse> {
        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (date_requested) {
            const { startDate, endDate } = getDateRange(date_requested);

            whereCondition.mct_date = {
                gte: startDate,
                lte: endDate,
            };

        }

        if (requested_by_id) {
            whereCondition = { ...whereCondition, mrv: { requested_by_id: requested_by_id } }
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

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.mCT.findMany({
                include: {
                    mcrts: {
                        select: {
                            id: true,
                            mcrt_number: true,
                        }
                    },
                    mrv: {
                        include: {
                            mrv_items: {
                                include: {
                                    mrv: {
                                        select: {
                                            mct: {
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
                                            }
                                        }
                                    },
                                    item: {
                                        include: {
                                            unit: true,
                                            item_transactions: true,
                                        }
                                    },
                                }
                            }
                        }
                    },
                },
                where: whereCondition,
                orderBy: {
                    mct_number: 'desc'
                },
                skip,
                take: pageSize,
            }),
            this.prisma.mCT.count({
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

    async findMctsByMctNumber(mctNumber: string, includeDetails: boolean = false) {

		const trimmedMctNumber = mctNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                mct_number: true, 
                mrv: true
            }; 
        } else {
            selectClause = { mct_number: true };
        }

        const items = await this.prisma.mCT.findMany({
            select: selectClause,
            where: {
                mct_number: {
                    startsWith: trimmedMctNumber
                },
                cancelled_at: null
            },
            orderBy: {
                mct_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async getStatus(id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.mCTApprover.findMany({
            where: {
                mct_id: id,
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

    async canUpdateForm(mctId: string): Promise<Boolean> {
        const mct = await this.prisma.mCT.findUnique({
            where: {
                id: mctId
            },
            select: {
                created_by: true,
                mct_approvers: true
            }
        })

        const hasPermission = mct.created_by === this.authUser.user.username || isAdmin(this.authUser);

        if (!hasPermission) {
            return false;
        }

        const hasApproval = mct.mct_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

    private async getLatestMctNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.mCT.findFirst({
            where: { mct_number: { startsWith: currentYear } },
            orderBy: { mct_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.mct_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

    private canAccess(item: MCT): boolean {

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

    private async canCreate(input: CreateMctInput): Promise<boolean> {

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

}
