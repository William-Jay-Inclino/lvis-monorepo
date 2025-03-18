import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { AssignTaskInput } from './dto/assign-task.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { Prisma, Task } from 'apps/powerserve/prisma/generated/client';
import { TASK_STATUS } from './entities/constants';
import { ComplaintService } from '../complaint/complaint.service';
import { COMPLAINT_STATUS } from '../complaint/entities/constants';
import { UpdateTaskStatusInput } from './dto/update-task-status.input';
import { MutationTaskResponse } from './entities/mutation-task-response';
import { DB_TABLE } from '../__common__/types';
import { Task as TaskEntity } from "./entities/task.entity";
import { FindAllTaskResponse } from './entities/find-all-response';
import { getDateRange } from 'libs/utils';
import { endOfYear, startOfYear } from 'date-fns';

@Injectable()
export class TaskService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
        private readonly complaintService: ComplaintService,
    ) {}

    async findAll(payload: {
        page: number, 
        pageSize: number, 
        created_at?: string, 
        assignee_id?: string
    }): Promise<FindAllTaskResponse> {

        const { page, pageSize, created_at, assignee_id } = payload

        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (created_at) {
            const { startDate, endDate } = getDateRange(created_at);

            whereCondition.created_at = {
                gte: startDate,
                lte: endDate,
            };
        }

        if (assignee_id) {
            whereCondition.assignee_id = {
                equals: assignee_id,
            };
        }

        // Default to current year's records if neither filter is provided
        if (!created_at && !assignee_id) {
            const startOfYearDate = startOfYear(new Date());
            const endOfYearDate = endOfYear(new Date());

            whereCondition.created_at = {
                gte: startOfYearDate,
                lte: endOfYearDate,
            };
        }

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.task.findMany({
                include: {
                    status: true,
                    activity: true,
                },
                where: whereCondition,
                orderBy: {
                    ref_number: 'desc',
                },
                skip,
                take: pageSize,
            }),
            this.prisma.task.count({
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

    async assign_task_transaction(payload: {
        input: AssignTaskInput,
        metadata: {
            ip_address: string, 
            device_info: any,
            authUser: AuthUser,
        }
    }): Promise<MutationTaskResponse> {
        
        const { input, metadata } = payload
        const { ip_address, device_info, authUser } = metadata
        
        const result = await this.prisma.$transaction(async(tx) => {

            const task = await this.assign_task({ input, authUser, tx: tx as Prisma.TransactionClient })

            // create audit
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.TASK,
                action: 'ASSIGN-TASK',
                reference_id: task.ref_number,
                metadata: task,
                ip_address: ip_address,
                device_info: device_info
            }, tx as Prisma.TransactionClient)

            return task

        })

        if(result) {
            return {
                success: true,
                msg: 'Task assigned successfully!',
                data: result as unknown as TaskEntity,
            }
        } else {
            return {
                success: false,
                msg: 'Failed to assign task!'
            }
        }

    }

    async assign_task(payload: {
        input: AssignTaskInput,
        authUser: AuthUser,
        tx: Prisma.TransactionClient,
    }): Promise<Task> {

        const { input, tx, authUser } = payload 
        const { task_id, assignee_id, remarks, will_start } = input

        // assign task
        const task = await tx.task.update({
            where: { id: task_id },
            data: {
                assignee_id,
            }
        })

        // update status
        if(will_start) {
            await this.update_status({
                input: {
                    task_status_id: TASK_STATUS.ONGOING,
                    task_id: task_id,
                    remarks: remarks,
                },
                authUser,
                tx: tx as Prisma.TransactionClient
            })

            await this.complaintService.update_status({
                input: {
                    complaint_status_id: COMPLAINT_STATUS.IN_PROGRESS,
                    complaint_id: task.complaint_id,
                    remarks: 'System: The assignee assigned the task and began work',
                },
                authUser,
                tx: tx as Prisma.TransactionClient
            })

        } else {
            await this.update_status({
                input: {
                    task_status_id: TASK_STATUS.ASSIGNED,
                    task_id: task_id,
                    remarks: '',
                },
                authUser,
                tx: tx as Prisma.TransactionClient
            })
        }

        return await this.get_task({ id: task_id, tx: tx as Prisma.TransactionClient })

    }

    async update_status(payload: {
        input: UpdateTaskStatusInput,
        authUser: AuthUser,
        tx: Prisma.TransactionClient
    }): Promise<Task> {

        const { input, authUser, tx } = payload
        const { task_status_id, task_id, remarks } = input

        // update status
        const task = await tx.task.update({
            where: { id: task_id },
            data: {
                status: { connect: { id: task_status_id } }
            }
        })

        // create log
        const log: Prisma.TaskLogCreateInput = {
            task: { connect: { id: task_id } },
            status: { connect: { id: task_status_id } },
            remarks,
            created_by: authUser.user.username,
        }

        await tx.taskLog.create({ data: log })

        return task

    }

    async get_task(payload: { id: number, tx: Prisma.TransactionClient }): Promise<Task> {
        
        const { id, tx } = payload

        return await tx.task.findUnique({ 
            where: { id },
            include: {
                complaint: {
                    include: {
                        complaint_detail: {
                            include: {
                                barangay: {
                                    include: {
                                        municipality: true,
                                    }
                                },
                                sitio: true,
                            }
                        },
                        status: true
                    }
                },
                logs: {
                    include: {
                        status: true,
                    }
                },
                files: true,
                status: true,
                task_detail_power_interruption: {
                    include: {
                        lineman: true,
                        feeder: true,
                        weather_condition: true,
                        device: true,
                    }
                },
                task_detail_kwh_meter: {
                    include: {
                        lineman: true,
                        meter_brand: true,
                    }
                },
                task_detail_line_services: {
                    include: {
                        lineman: true,
                    }
                },
                task_detail_dles: {
                    include: {
                        lineman: true,
                    }
                },
                task_detail_lmdga: {
                    include: {
                        lineman: true,
                    }
                }
            }
        })
    }

    async get_tasks_by(payload: { complaint_id: number }): Promise<Task[]> {
        
        const { complaint_id } = payload

        return await this.prisma.task.findMany({ 
            where: { complaint_id },
            include: {
                logs: {
                    include: {
                        status: true,
                    }
                },
                files: true,
                status: true,
                task_detail_power_interruption: {
                    include: {
                        lineman: true,
                        feeder: true,
                        weather_condition: true,
                        device: true,
                    }
                },
                task_detail_kwh_meter: {
                    include: {
                        lineman: true,
                        meter_brand: true,
                    }
                },
                task_detail_line_services: {
                    include: {
                        lineman: true,
                    }
                },
                task_detail_dles: {
                    include: {
                        lineman: true,
                    }
                },
                task_detail_lmdga: {
                    include: {
                        lineman: true,
                    }
                }
            }
        })
    }

}
