import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRvApproverInput } from './dto/create-rv-approver.input';
import { UpdateRvApproverInput } from './dto/update-rv-approver.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Pending, Prisma, RVApprover } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS } from '../__common__/types';
import { AuthUser } from '../__common__/auth-user.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { isAdmin, isValidApprovalStatus } from '../__common__/helpers';
import { UpdateRVOrderResponse } from './entities/update-rv-order-response.entity';
import { DB_ENTITY } from '../__common__/constants';

@Injectable()
export class RvApproverService {

    private readonly logger = new Logger(RvApproverService.name);
    private authUser: AuthUser
    private includedFields = {
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
        }
    }

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    // setAuthUser(authUser: AuthUser) {
    //     this.authUser = authUser
    // }

    // async create(input: CreateRvApproverInput): Promise<RVApprover> {

    //     const employeeIds = []

    //     employeeIds.push(input.approver_id)

    //     if (employeeIds.length > 0) {
    //         const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

    //         if (!isValidEmployeeIds) {
    //             throw new BadRequestException("One or more employee id is invalid")
    //         }
    //     }

    //     const data: Prisma.RVApproverCreateInput = {
    //         rv: { connect: { id: input.rv_id } },
    //         approver_id: input.approver_id,
    //         label: input.label,
    //         order: input.order,
    //         notes: '',
    //         status: APPROVAL_STATUS.PENDING,
    //         is_supervisor: input.is_supervisor ? input.is_supervisor : false,
    //     }

    //     const created = await this.prisma.rVApprover.create({
    //         data,
    //         include: this.includedFields
    //     })

    //     this.logger.log('Successfully created rVApprover')

    //     return created
    // }

    // findOne(id: string): Promise<RVApprover | null> {

    //     const item = this.prisma.rVApprover.findUnique({
    //         where: { id },
    //         include: this.includedFields
    //     })

    //     if (!item) {
    //         throw new NotFoundException('RV Approver not found')
    //     }

    //     return item

    // }

    async findByRvId(rvId: string): Promise<RVApprover[]> {

        this.logger.log('findByRvId()', rvId)

        if (!rvId) {
            throw new BadRequestException('rv_id is undefined')
        }

        return await this.prisma.rVApprover.findMany({
            // include: this.includedFields,
            where: {
                rv_id: rvId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }

    // async findByRvNumber(rvNumber: string): Promise<RVApprover[]> {
    //     return await this.prisma.rVApprover.findMany({
    //         include: this.includedFields,
    //         where: {
    //             rv: {
    //                 rv_number: rvNumber
    //             }
    //         },
    //         orderBy: {
    //             order: 'asc'
    //         }
    //     })
    // }

    // RV supervisor and RV approver (is_supervisor) should always be in sync
    // async update(id: string, input: UpdateRvApproverInput): Promise<RVApprover> {
    //     this.logger.log('update()')


    //     const existingItem = await this.prisma.rVApprover.findUnique({
    //         where: { id },
    //         include: {
    //             rv: {
    //                 select: {
    //                     id: true,
    //                     rv_number: true,
    //                     rv_approvers: true
    //                 }
    //             },
    //         }
    //     })

    //     let isApprover = false

    //     if (this.authUser.user.user_employee && this.authUser.user.user_employee.employee) {
    //         isApprover = this.authUser.user.user_employee.employee.id === existingItem.approver_id
    //     }

    //     console.log('isApprover', isApprover)

    //     if (!isAdmin(this.authUser) && !isApprover) {
    //         throw new ForbiddenException('Only Admin and Approver can update')
    //     }

    //     await this.validateInput(input)

    //     // if admin get date approval from client else get date approval in server 

    //     let dateApproval = isAdmin(this.authUser) ? (input.date_approval ? new Date(input.date_approval) : new Date()) : new Date()
    //     console.log('dateApproval', dateApproval);

    //     if (input.status && input.status === APPROVAL_STATUS.PENDING) {
    //         dateApproval = null
    //     } else if (!dateApproval) {
    //         dateApproval = existingItem.date_approval
    //     }

    //     const data: Prisma.RVApproverUpdateInput = {
    //         approver_id: input.approver_id ?? existingItem.approver_id,
    //         date_approval: dateApproval,
    //         notes: input.notes ?? existingItem.notes,
    //         status: input.status ?? existingItem.status,
    //         label: input.label ?? existingItem.label,
    //         order: input.order ?? existingItem.order,
    //         is_supervisor: input.is_supervisor ?? existingItem.is_supervisor,
    //     }

    //     const queries = []

    //     const updateRvApproverQuery = this.prisma.rVApprover.update({
    //         data,
    //         where: { id },
    //         include: this.includedFields,
    //     });

    //     queries.push(updateRvApproverQuery)

    //     // if approver is updated
    //     if(input.approver_id) {

    //         const isNewApprover = input.approver_id !== existingItem.approver_id

    //         // update supervisor in rv table as well
    //         if(existingItem.is_supervisor && isNewApprover) {

    //             console.log('updating rv supervisor');
    //             const updateRvSupervisorQuery = this.prisma.rV.update({
    //                 data: {
    //                     supervisor_id: input.approver_id
    //                 },
    //                 where: {
    //                     id: existingItem.rv.id
    //                 }
    //             })

    //             queries.push(updateRvSupervisorQuery)
    //         }

    //     }

    //     // if status is updated, update also pendings table.
    //     if(input.status) {
    //         const approverId = input.approver_id ?? existingItem.approver_id

    //         const pending = await this.prisma.pending.findUnique({
    //             where: {
    //                 approver_id_reference_number_reference_table: {
    //                     approver_id: approverId,
    //                     reference_number: existingItem.rv.rv_number,
    //                     reference_table: DB_ENTITY.RV
    //                 }
    //             }
    //         })

    //         const updatePendingQuery = this.updatePendingTblQuery(input.status, approverId, existingItem.rv.rv_number, DB_ENTITY.RV, pending)

    //         if(updatePendingQuery) {
    //             queries.push(updatePendingQuery)
    //         }
    //     }


    //     const result = await this.prisma.$transaction(queries)

    //     this.logger.log('Successfully updated RV Approver');

    //     return result[0]

    // }

    // private updatePendingTblQuery(status: APPROVAL_STATUS, approver_id: string, reference_number: string, reference_table: string, pending: Pending) {

    //     console.log('updatePendingTblQuery');

    //     // do nothing since already in pending table
    //     if(status === APPROVAL_STATUS.PENDING && pending) {
    //         console.log('No execution: approver already in pendings table');
    //         return null
    //     }

    //     // do nothing since status is not pending and not found in pendings table
    //     if(status !== APPROVAL_STATUS.PENDING && !pending) {
    //         console.log('No execution: Status is not pending and not found in pendings table');
    //         return null
    //     }

    //     // remove 
    //     if(status !== APPROVAL_STATUS.PENDING && pending) {
    //         console.log('removing approver in pendings table...');
    //         return this.prisma.pending.delete({
    //             where: {
    //                 id: pending.id
    //             }
    //         })
    //     }

    //     // insert in pendings
    //     if(status === APPROVAL_STATUS.PENDING && !pending) {
    //         console.log('adding approver in pendings table...');
    //         return this.prisma.pending.create({
    //             data: {
    //                 approver_id,
    //                 reference_number,
    //                 reference_table,
    //                 description: `RV no. ${reference_number}`,
    //             }
    //         })
    //     }
        
    // }

    // async remove(id: string): Promise<WarehouseRemoveResponse> {

    //     const existingItem = await this.findOne(id)

    //     await this.prisma.rVApprover.update({
    //         where: { id },
    //         data: {
    //             deleted_at: new Date(),
    //             deleted_by: this.authUser.user.username
    //         }
    //     })

    //     return {
    //         success: true,
    //         msg: "RV Approver successfully deleted"
    //     }

    // }

    // async updateManyOrders(inputs: { id: string; order: number }[]): Promise<UpdateRVOrderResponse> {
    //     try {

    //         const queries = []

    //         for (let input of inputs) {

    //             const updateQuery = this.prisma.rVApprover.update({
    //                 where: { id: input.id },
    //                 data: { order: input.order },
    //                 select: {
    //                     rv_id: true
    //                 }
    //             })

    //             queries.push(updateQuery)

    //         }

    //         const result = await this.prisma.$transaction(queries)

    //         const rv = result[0] as RVApprover

    //         console.log('rv', rv)

    //         const approvers = await this.findByRvId(rv.rv_id)

    //         return {
    //             success: true,
    //             approvers: approvers
    //         };
    //     } catch (error) {
    //         this.logger.error(error);
    //         return { success: false, approvers: [] };
    //     }
    // }

    // async forEmployeePendingApprovals(employeeId: string): Promise<RVApprover[]> {
    //     return await this.prisma.rVApprover.findMany({
    //         where: {
    //             approver_id: employeeId,
    //             status: APPROVAL_STATUS.PENDING,
    //             deleted_at: null,
    //             rv: {
    //                 cancelled_at: null
    //             }
    //         },
    //         orderBy: {
    //             created_at: 'asc'
    //         },
    //         include: {
    //             rv: {
    //                 include: {
    //                     rv_approvers: {
    //                         where: {
    //                             deleted_at: null
    //                         },
    //                         orderBy: {
    //                             order: 'asc'
    //                         }
    //                     },
    //                 }
    //             }
    //         }
    //     })
    // }

    // private async areEmployeesExist(employeeIds: string[], authUser: AuthUser): Promise<boolean> {

    //     this.logger.log('areEmployeesExist', employeeIds);

    //     const query = `
    //         query {
    //             validateEmployeeIds(ids: ${JSON.stringify(employeeIds)})
    //         }
    //     `;

    //     console.log('query', query)
    //     console.log('authUser', authUser)

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

    // private async validateInput(input: UpdateRvApproverInput): Promise<void> {
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

    //     console.log('employeeIds', employeeIds)
    //     if (employeeIds.length > 0) {
    //         const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

    //         if (!isValidEmployeeIds) {
    //             throw new BadRequestException("One or more employee id is invalid")
    //         }
    //     }
    // }

}
