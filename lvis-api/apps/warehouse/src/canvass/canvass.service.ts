import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateCanvassInput } from './dto/create-canvass.input';
import { Canvass, Prisma } from 'apps/warehouse/prisma/generated/client';
import { UpdateCanvassInput } from './dto/update-canvass.input';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CanvassesResponse } from './entities/canvasses-response.entity';
import { FindOneResponse } from './entities/types';
import * as moment from 'moment';
import { getDateRange, isAdmin } from '../__common__/helpers';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { startOfYear, endOfYear } from 'date-fns';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@Injectable()
export class CanvassService {

    private authUser: AuthUser
    private includedFields = {
        canvass_items: {
            include: {
                unit: true,
                item: true
            }
        },
        rv: {
            include: {
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
                }
            }
        },
        jo: {
            include: {
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
                }
            }
        },
        spr: {
            include: {
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
                }
            }
        }
    }

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async create(input: CreateCanvassInput, metadata: { ip_address: string, device_info: any }): Promise<Canvass> {

        const isValidRequestedById = await this.areEmployeesExist([input.requested_by_id], this.authUser)

        if (!isValidRequestedById) {
            throw new NotFoundException('Requested by ID not valid')
        }

        const rcNumber = await this.getLatestRcNumber()
        const today = moment().format('MM/DD/YYYY')

        const createdBy = this.authUser.user.username

        const data: Prisma.CanvassCreateInput = {
            rc_number: rcNumber,
            date_requested: new Date(today),
            purpose: input.purpose,
            notes: input.notes,
            requested_by_id: input.requested_by_id,
            created_by: createdBy,
            canvass_items: {
                create: input.canvass_items.map((item) => {
                    return {
                        unit: item.unit_id ? { connect: { id: item.unit_id } } : undefined,
                        item: item.item_id ? { connect: { id: item.item_id } } : undefined,
                        description: item.description,
                        quantity: item.quantity,
                    }
                })
            }
        }

        return await this.prisma.$transaction(async(tx) => {

            const created = await tx.canvass.create({
                data,
                include: {
                    canvass_items: true
                }
            })

            // create audit
            await this.audit.createAuditEntry({
                username: this.authUser.user.username,
                table: DB_TABLE.CANVASS,
                action: 'CREATE-CANVASS',
                reference_id: created.id,
                metadata: created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)
    
            return created

        })


    }

    async update(id: string, input: UpdateCanvassInput, metadata: { ip_address: string, device_info: any }): Promise<Canvass> {

        return await this.prisma.$transaction(async(tx) => {

            const existingItem = await tx.canvass.findUnique({
                where: { id },
                include: {
                    canvass_items: true,
                }
            })
    
            if (!(await this.canUpdate(existingItem.id, tx as Prisma.TransactionClient))) {
                throw new ForbiddenException('Only Admin and Owner can update this record. Cannot also update if rv/spr/jo has approval for owners only!')
            }
    
            if (input.requested_by_id) {
                const isValidRequestedById = await this.areEmployeesExist([input.requested_by_id], this.authUser);
    
                if (!isValidRequestedById) {
                    throw new NotFoundException('Requested by ID not found');
                }
            }
    
            const data: Prisma.CanvassUpdateInput = {
                purpose: input.purpose ?? existingItem.purpose,
                notes: input.notes ?? existingItem.notes,
                requested_by_id: input.requested_by_id ?? existingItem.requested_by_id,
                updated_by: this.authUser.user.username,
            };
    
            const updated = await tx.canvass.update({
                data,
                where: { id },
                include: {
                    canvass_items: true,
                }
            });
    
            // create audit
            await this.audit.createAuditEntry({
                username: this.authUser.user.username,
                table: DB_TABLE.CANVASS,
                action: 'UPDATE-CANVASS',
                reference_id: id,
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

    // async update(id: string, input: UpdateCanvassInput, metadata: { ip_address: string, device_info: any }): Promise<Canvass> {
    //     const existingItem = await this.findOne(id);

    //     if (!(await this.canUpdate(existingItem.id))) {
    //         throw new ForbiddenException('Only Admin and Owner can update this record. Cannot also update if rv/spr/jo has approval for owners only!')
    //     }

    //     if (input.requested_by_id) {
    //         const isValidRequestedById = await this.areEmployeesExist([input.requested_by_id], this.authUser);

    //         if (!isValidRequestedById) {
    //             throw new NotFoundException('Requested by ID not found');
    //         }
    //     }

    //     const data: Prisma.CanvassUpdateInput = {
    //         purpose: input.purpose ?? existingItem.purpose,
    //         notes: input.notes ?? existingItem.notes,
    //         requested_by_id: input.requested_by_id ?? existingItem.requested_by_id,
    //         updated_by: this.authUser.user.username,
    //     };

    //     return this.prisma.$transaction(async(tx) => {

    //         const updated = await tx.canvass.update({
    //             data,
    //             where: { id },
    //         });
    
    //         // create audit
	// 		await this.audit.createAuditEntry({
	// 			username: this.authUser.user.username,
	// 			table: DB_TABLE.CANVASS,
	// 			action: 'UPDATE-CANVASS',
	// 			reference_id: id,
	// 			metadata: {
	// 				'old_value': existingItem,
	// 				'new_value': updated
	// 			},
	// 			ip_address: metadata.ip_address,
	// 			device_info: metadata.device_info
	// 		}, tx as Prisma.TransactionClient)

    //         return updated

    //     })

    // }

    async findAll(page: number, pageSize: number, date_requested?: string, requested_by_id?: string): Promise<CanvassesResponse> {

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
            whereCondition.requested_by_id = {
                equals: requested_by_id,
            };
        }

        // Default to current year's records if neither filter is provided
        if (!date_requested && !requested_by_id) {
            const startOfYearDate = startOfYear(new Date());
            const endOfYearDate = endOfYear(new Date());

            whereCondition.created_at = {
                gte: startOfYearDate,
                lte: endOfYearDate,
            };
        }

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.canvass.findMany({
                include: this.includedFields,
                where: whereCondition,
                orderBy: {
                    rc_number: 'desc',
                },
                skip,
                take: pageSize,
            }),
            this.prisma.canvass.count({
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

    async findOne(id: string): Promise<FindOneResponse> {

        const item = await this.prisma.canvass.findUnique({
            include: this.includedFields,
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('Canvass not found')
        }

        return item

    }

    async findByRcNumber(rc_number: string): Promise<Canvass> {

        const item = await this.prisma.canvass.findUnique({
            include: this.includedFields,
            where: { rc_number }
        })

        if (!item) {
            throw new NotFoundException('Canvass not found')
        }

        return item

    }

    async findCanvassesByRcNumber(rcNumber: string, includeDetails: boolean = false) {

		const trimmedRcNumber = rcNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                rc_number: true, 
                purpose: true,
                notes: true,
                requested_by_id: true
            }; 
        } else {
            selectClause = { rc_number: true };
        }

        const items = await this.prisma.canvass.findMany({
            select: selectClause,
            where: {
                rc_number: {
                    startsWith: trimmedRcNumber
                },
            },
            orderBy: {
                rc_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    private async getLatestRcNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.canvass.findFirst({
            where: { rc_number: { startsWith: currentYear } },
            orderBy: { rc_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.rc_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00030`;
        }
    }

    async forEmployee(employeeId: string): Promise<Canvass[]> {
        return await this.prisma.canvass.findMany({
            where: {
                requested_by_id: employeeId,
            }
        })
    }

    // async remove(id: string): Promise<WarehouseRemoveResponse> {

    //     return await this.prisma.$transaction(async(tx) => {

    //         const existingItem = await tx.canvass.findUnique({ where: { id } })

    //         if(!existingItem) {
    //             throw new NotFoundException('Canvass not found with id ' + id)
    //         }

    //         if (!this.canAccess(existingItem)) {
    //             throw new ForbiddenException('Only Admin and Owner can remove this record!')
    //         }
    
    //         await tx.canvass.delete({
    //             where: { id }
    //         })
    
    //         return {
    //             success: true,
    //             msg: "Canvass successfully deleted"
    //         }

    //     })


    // }

    async isReferenced(canvassId: string): Promise<Boolean> {

        const rv = await this.prisma.rV.findUnique({
            where: { canvass_id: canvassId }
        })

        if (rv) return true

        const spr = await this.prisma.sPR.findUnique({
            where: { canvass_id: canvassId }
        })

        if (spr) return true

        const jo = await this.prisma.jO.findUnique({
            where: { canvass_id: canvassId }
        })

        if (jo) return true


        return false

    }

    async isReferencedInRR(canvassId: string): Promise<Boolean> {

        const rr = await this.prisma.rR.findFirst({
            select: {
                id: true
            },
            where: {
                po: {
                    meqs_supplier: {
                        meqs: {
                            OR: [
                                {
                                    rv: {
                                        canvass_id: canvassId
                                    }
                                },
                                {
                                    spr: {
                                        canvass_id: canvassId
                                    }
                                },
                                {
                                    jo: {
                                        canvass_id: canvassId
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        })

        return !!rr

    }

    // cannot update if not owner or admin
    // can only update canvass if admin AND if either rvApprovers, sprApprovers, or rvApprovers all pending 
    async canUpdate(canvassId: string, tx?: Prisma.TransactionClient): Promise<Boolean> {

        const prismaClient = tx || this.prisma;

        const canvass = await prismaClient.canvass.findUnique({
            where: { id: canvassId },
            select: {
                created_by: true,
                rv: { select: { rv_approvers: true } },
                spr: { select: { spr_approvers: true } },
                jo: { select: { jo_approvers: true } }
            }
        });

        if (!canvass) {
            throw new NotFoundException('Canvass not found with id of ' + canvassId)
        }

        const hasPermission = canvass.created_by === this.authUser.user.username || isAdmin(this.authUser);

        if (!hasPermission) {
            return false;
        }

        if (canvass.rv) {
            const hasApproverAction = canvass.rv.rv_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

            if (hasApproverAction) {
                return false
            }
        }

        if (canvass.spr) {
            const hasApproverAction = canvass.spr.spr_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

            if (hasApproverAction) {
                return false
            }
        }

        if (canvass.jo) {
            const hasApproverAction = canvass.jo.jo_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

            if (hasApproverAction) {
                return false
            }
        }


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

        }
    }

}
