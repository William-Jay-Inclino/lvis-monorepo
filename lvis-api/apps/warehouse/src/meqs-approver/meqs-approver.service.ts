import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMeqsApproverInput } from './dto/create-meqs-approver.input';
import { UpdateMeqsApproverInput } from './dto/update-meqs-approver.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, MEQSApprover } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS } from '../__common__/types';
import { AuthUser } from '../__common__/auth-user.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { isAdmin, isValidApprovalStatus } from '../__common__/helpers';
import { UpdateMeqsOrderResponse } from './entities/update-meqs-order-response.entity';

@Injectable()
export class MeqsApproverService {

    private readonly logger = new Logger(MeqsApproverService.name);
    private authUser: AuthUser
    private includedFields = {
        meqs: {
            include: {
                rv: {
                    include: {
                        canvass: {
                            include: {
                                canvass_items: {
                                    include: {
                                        unit: true,
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
    ) { }

    // setAuthUser(authUser: AuthUser) {
    //     this.authUser = authUser
    // }

    // async create(input: CreateMeqsApproverInput): Promise<MEQSApprover> {

    //     const employeeIds = []

    //     employeeIds.push(input.approver_id)

    //     if (employeeIds.length > 0) {
    //         const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

    //         if (!isValidEmployeeIds) {
    //             throw new BadRequestException("One or more employee id is invalid")
    //         }
    //     }

    //     const createdBy = this.authUser.user.username

    //     const data: Prisma.MEQSApproverCreateInput = {
    //         meqs: { connect: { id: input.meqs_id } },
    //         approver_id: input.approver_id,
    //         label: input.label,
    //         order: input.order,
    //         notes: '',
    //         status: APPROVAL_STATUS.PENDING,
    //         created_by: createdBy
    //     }

    //     const created = await this.prisma.mEQSApprover.create({
    //         data,
    //         include: this.includedFields
    //     })

    //     this.logger.log('Successfully created mEQSApprover')

    //     return created
    // }

    // async findAll(): Promise<MEQSApprover[]> {
    //     return await this.prisma.mEQSApprover.findMany({
    //         include: this.includedFields,
    //         where: { is_deleted: false },
    //         orderBy: {
    //             order: 'asc'
    //         }
    //     })
    // }

    // async findOne(id: string): Promise<MEQSApprover | null> {

    //     const item = await this.prisma.mEQSApprover.findUnique({
    //         where: { id },
    //         include: this.includedFields
    //     })

    //     if (!item) {
    //         throw new NotFoundException('MEQS Approver not found')
    //     }

    //     return item

    // }

    async findByMeqsId(meqsId: string): Promise<MEQSApprover[]> {

        this.logger.log('findByMeqsId()', meqsId)

        return await this.prisma.mEQSApprover.findMany({
            // include: this.includedFields,
            where: {
                meqs_id: meqsId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }

    // async findByMeqsNumber(meqsNumber: string): Promise<MEQSApprover[]> {
    //     return await this.prisma.mEQSApprover.findMany({
    //         include: this.includedFields,
    //         where: {
    //             deleted_at: null,
    //             meqs: {
    //                 meqs_number: meqsNumber
    //             }
    //         },
    //         orderBy: {
    //             order: 'asc'
    //         }
    //     })
    // }

    // async update(id: string, input: UpdateMeqsApproverInput): Promise<MEQSApprover> {
    //     this.logger.log('update()')

    //     const existingItem = await this.findOne(id)

    //     let isApprover = false

    //     if (this.authUser.user.user_employee && this.authUser.user.user_employee.employee) {
    //         isApprover = this.authUser.user.user_employee.employee.id === existingItem.approver_id
    //     }

    //     console.log('isApprover', isApprover)

    //     if (!isAdmin(this.authUser) && !isApprover) {
    //         throw new ForbiddenException('Only Admin and Approver can update')
    //     }

    //     await this.validateInput(input)

    //     let dateApproval = isAdmin(this.authUser) ? (input.date_approval ? new Date(input.date_approval) : new Date()) : new Date()

    //     console.log('dateApproval', dateApproval);

    //     if (input.status && input.status === APPROVAL_STATUS.PENDING) {
    //         dateApproval = null
    //     } else if (!dateApproval) {
    //         dateApproval = existingItem.date_approval
    //     }

    //     const updatedBy = this.authUser.user.username

    //     const data: Prisma.RVApproverUpdateInput = {
    //         approver_id: input.approver_id ?? existingItem.approver_id,
    //         date_approval: dateApproval,
    //         notes: input.notes ?? existingItem.notes,
    //         status: input.status ?? existingItem.status,
    //         label: input.label ?? existingItem.label,
    //         order: input.order ?? existingItem.order,
    //         updated_by: updatedBy
    //     }

    //     const updated = await this.prisma.mEQSApprover.update({
    //         data,
    //         where: { id },
    //         include: this.includedFields,
    //     });
    //     this.logger.log('Successfully updated MEQS Approver');

    //     console.log('updated', updated);
    //     return updated;

    // }

    // async remove(id: string): Promise<WarehouseRemoveResponse> {

    //     const existingItem = await this.findOne(id)

    //     await this.prisma.mEQSApprover.update({
    //         where: { id },
    //         data: {
    //             deleted_at: new Date(),
    //             deleted_by: this.authUser.user.username
    //         }
    //     })

    //     return {
    //         success: true,
    //         msg: "MEQS Approver successfully deleted"
    //     }

    // }

    // async updateManyOrders(inputs: { id: string; order: number }[]): Promise<UpdateMeqsOrderResponse> {
    //     try {

    //         const queries = []

    //         for (let input of inputs) {

    //             const updateQuery = this.prisma.mEQSApprover.update({
    //                 where: { id: input.id },
    //                 data: { order: input.order },
    //                 select: {
    //                     meqs_id: true
    //                 }
    //             })

    //             queries.push(updateQuery)

    //         }

    //         const result = await this.prisma.$transaction(queries)

    //         const meqs = result[0] as MEQSApprover

    //         console.log('meqs', meqs)

    //         const approvers = await this.findByMeqsId(meqs.meqs_id)

    //         return {
    //             success: true,
    //             approvers: approvers
    //         };
    //     } catch (error) {
    //         this.logger.error(error);
    //         return { success: false, approvers: [] };
    //     }
    // }

    // private async areEmployeesExist(employeeIds: string[], authUser: AuthUser): Promise<boolean> {

    //     this.logger.log('areEmployeesExist', employeeIds);

    //     const query = `
    //         query {
    //             validateEmployeeIds(ids: ${JSON.stringify(employeeIds)})
    //         }
    //     `;

    //     console.log('query', query)

    //     try {
    //         const { data } = await firstValueFrom(
    //             this.httpService.post(
    //                 process.env.API_GATEWAY_URL,
    //                 { query },
    //                 {
    //                     headers: {
    //                         Authorization: authUser.authorization,
    //                         'Content-Type': 'application/json',
    //                     },
    //                 }
    //             ).pipe(
    //                 catchError((error) => {
    //                     throw error;
    //                 }),
    //             ),
    //         );

    //         console.log('data', data);
    //         console.log('data.data.validateEmployeeIds', data.data.validateEmployeeIds)

    //         if (!data || !data.data) {
    //             console.log('No data returned');
    //             return false;
    //         }

    //         return data.data.validateEmployeeIds;

    //     } catch (error) {
    //         console.error('Error querying employees:', error.message);
    //         return false;
    //     }
    // }

    // async forEmployeePendingApprovals(employeeId: string): Promise<MEQSApprover[]> {
    //     return await this.prisma.mEQSApprover.findMany({
    //         where: {
    //             approver_id: employeeId,
    //             status: APPROVAL_STATUS.PENDING,
    //             deleted_at: null,
    //             meqs: {
    //                 cancelled_at: null
    //             }
    //         },
    //         orderBy: {
    //             created_at: 'asc'
    //         },
    //         include: {
    //             meqs: {
    //                 include: {
    //                     meqs_approvers: {
    //                         where: {
    //                             deleted_at: null
    //                         },
    //                         orderBy: {
    //                             order: 'asc'
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     })
    // }

    // private async validateInput(input: UpdateMeqsApproverInput): Promise<void> {
    //     if (input.status && !isValidApprovalStatus(input.status)) {
    //         throw new BadRequestException('Invalid status value');
    //     }

    //     if (input.status && input.status === APPROVAL_STATUS.CANCELLED) {
    //         throw new BadRequestException('Cancelled status not allowed');
    //     }

    //     const employeeIds = []

    //     if (input.approver_id) {
    //         employeeIds.push(input.approver_id)
    //     }

    //     if (employeeIds.length > 0) {
    //         const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

    //         if (!isValidEmployeeIds) {
    //             throw new BadRequestException("One or more employee id is invalid")
    //         }
    //     }
    // }

}
