import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { AssignTaskInput } from './dto/assign-task.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { Prisma, Task } from 'apps/powerserve/prisma/generated/client';
import { TASK_STATUS } from './entities/constants';
import { ComplaintService } from '../complaint/complaint.service';
import { ASSIGNED_GROUP_TYPE, COMPLAINT_STATUS } from '../complaint/entities/constants';
import { UpdateTaskStatusInput } from './dto/update-task-status.input';
import { MutationTaskResponse } from './entities/mutation-task-response';
import { DB_TABLE } from '../__common__/types';
import { Task as TaskEntity } from "./entities/task.entity";
import { FindAllTaskResponse } from './entities/find-all-response';
import { getDateRange } from 'libs/utils';
import { endOfYear, startOfYear } from 'date-fns';
import { UpdateTaskInput } from './dto/update-task.input';
import { CreateTaskInput } from './dto/create-task.input';
import { generateReferenceNumber } from '../__common__/helpers';
import { DB_ENTITY } from '../__common__/constants';
import { TaskDetailKwhMeterService } from '../task_detail_kwh_meter/task_detail_kwh_meter.service';
import { TaskDetailPowerInterruptionService } from '../task_detail_power_interruption/task_detail_power_interruption.service';
import { TaskDetailLineServicesService } from '../task_detail_line_services/task_detail_line_services.service';
import { TaskDetailDlesService } from '../task_detail_dles/task_detail_dles.service';
import { TaskDetailLmdgaService } from '../task_detail_lmdga/task_detail_lmdga.service';
import axios from 'axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskAssignedEvent, TaskEvents } from './events/task.events';

@Injectable()
export class TaskService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
        @Inject(forwardRef(() => ComplaintService))
        private readonly complaintService: ComplaintService,
        private readonly kwhMeterService: TaskDetailKwhMeterService,
        private readonly powerInterruptionService: TaskDetailPowerInterruptionService,
        private readonly lineServicesService: TaskDetailLineServicesService,
        private readonly dlesService: TaskDetailDlesService,
        private readonly lmdgaService: TaskDetailLmdgaService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async findAll(payload: {
        page: number, 
        pageSize: number, 
        created_at?: string, 
        assignee_id?: string,
        authUser: AuthUser,
        by_group?: boolean,
    }): Promise<FindAllTaskResponse> {

        const { page, pageSize, created_at, assignee_id, authUser, by_group } = payload

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

        if(by_group && authUser.user.user_employee.employee) {

            const employee = authUser.user.user_employee.employee

            const area = await this.prisma.area.findUnique({ where: { oic_id: employee.id } });
    
            const orConditions: any[] = [];

            if (area?.id) {
                orConditions.push({ task_assignment: { is: { area_id: area.id } } });
            }
        
            if (employee.division_id) {
                orConditions.push({ task_assignment: { is: { division_id: employee.division_id } } });
            }
        
            if (employee.department_id) {
                orConditions.push({ task_assignment: { is: { department_id: employee.department_id } } });
            }

            if (orConditions.length > 0) {
                whereCondition.OR = orConditions;
            }

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
                    task_assignment: true,
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

        // Use a Set to remove duplicates based on task ID
        const uniqueTasks = Array.from(new Map(items.map(task => [task.id, task])).values());

        return {
            data: uniqueTasks,
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

        console.log('assign_task_transaction');
        
        const { input, metadata } = payload
        const { ip_address, device_info, authUser } = metadata
        
        const result = await this.prisma.$transaction(async(tx) => {

            const { success, msg, task } = await this.assign_task({ input, authUser, tx: tx as unknown as Prisma.TransactionClient })

            if(success && task) {

                // create audit
                await this.audit.createAuditEntry({
                    username: authUser.user.username,
                    table: DB_TABLE.TASK,
                    action: 'ASSIGN-TASK',
                    reference_id: task.ref_number,
                    metadata: task,
                    ip_address: ip_address,
                    device_info: device_info
                }, tx as unknown as Prisma.TransactionClient)

                console.log('task.task_status_id', task.task_status_id);

                if(task.task_status_id === TASK_STATUS.ASSIGNED) {
                    this.eventEmitter.emit(
                        TaskEvents.ASSIGNED,
                        new TaskAssignedEvent(task as unknown as TaskEntity, authUser)
                    )
                }
    
                return { success, msg, data: task as unknown as TaskEntity }

            }

            return { success, msg }


        })

        return result

    }

    async update_status_transaction(payload: {
        input: UpdateTaskStatusInput,
        metadata: {
            ip_address: string, 
            device_info: any,
            authUser: AuthUser,
        }
    }): Promise<MutationTaskResponse> {

        const { input, metadata } = payload
        const { ip_address, device_info, authUser } = metadata
        
        const result = await this.prisma.$transaction(async(tx) => {

            const task = await this.update_status({ input, authUser, tx: tx as unknown as Prisma.TransactionClient })

            if(task) {

                // create audit
                await this.audit.createAuditEntry({
                    username: authUser.user.username,
                    table: DB_TABLE.TASK,
                    action: 'UPDATE-TASK-STATUS',
                    reference_id: task.ref_number,
                    metadata: task,
                    ip_address: ip_address,
                    device_info: device_info
                }, tx as unknown as Prisma.TransactionClient)
    
                return {
                    success: true,
                    msg: 'Task status successfully updated!',
                    data: task as unknown as TaskEntity 
                }

            }

            return {
                success: false,
                msg: 'Failed to update task status'
            }


        })

        return result

    }

    async create_task_transaction(payload: {
        input: CreateTaskInput,
        metadata: {
            ip_address: string, 
            device_info: any,
            authUser: AuthUser,
        }
    }): Promise<MutationTaskResponse> {
        const { input, metadata } = payload
        const { ip_address, device_info, authUser } = metadata

        const result = await this.prisma.$transaction(async(tx) => {

            const { success, msg, task } = await this.create_task({ input, authUser }, tx as unknown as Prisma.TransactionClient)

            if(success && task) {

                // create audit
                await this.audit.createAuditEntry({
                    username: authUser.user.username,
                    table: DB_TABLE.TASK,
                    action: 'CREATE-TASK',
                    reference_id: task.ref_number,
                    metadata: task,
                    ip_address: ip_address,
                    device_info: device_info
                }, tx as unknown as Prisma.TransactionClient)
    
                return { success, msg, data: task as unknown as TaskEntity }

            }

            return { success, msg }


        })

        return result
    }

    async update_task_transaction(payload: {
        input: UpdateTaskInput,
        metadata: {
            ip_address: string, 
            device_info: any,
            authUser: AuthUser,
        }
    }): Promise<MutationTaskResponse> {
        const { input, metadata } = payload
        const { ip_address, device_info, authUser } = metadata

        const result = await this.prisma.$transaction(async(tx) => {

            const existing_task = await this.get_existing_task({ task_id: input.task_id }, tx as unknown as Prisma.TransactionClient)
            
            // update task status
            // update COMPLAINT STATUS only if existing task status is pending, assigned, or ongoing
            await this.update_status({
                input: {
                    task_status_id: input.status_id,
                    task_id: input.task_id,
                    remarks: input.remarks,
                },
                should_update_complaint_status: [TASK_STATUS.PENDING, TASK_STATUS.ASSIGNED, TASK_STATUS.ONGOING].includes(existing_task.task_status_id),
                authUser,
                tx: tx as unknown as Prisma.TransactionClient,
            });

            const { success, msg, task } = await this.update_task({ input, tx: tx as unknown as Prisma.TransactionClient })

            if(success && task) {

                // create audit
                await this.audit.createAuditEntry({
                    username: authUser.user.username,
                    table: DB_TABLE.TASK,
                    action: 'UPDATE-TASK',
                    reference_id: task.ref_number,
                    metadata: {
                        'old_value': existing_task,
                        'new_value': task
                    },
                    ip_address: ip_address,
                    device_info: device_info
                }, tx as unknown as Prisma.TransactionClient)
    
                return { success, msg, data: task as unknown as TaskEntity }

            }

            return { success, msg }


        })

        return result
    }

    async create_task(payload: {
        input: CreateTaskInput,
        authUser: AuthUser
    }, tx: Prisma.TransactionClient): Promise<{
        success: boolean,
        msg: string,
        task?: Task
    }> {

        const { input, authUser } = payload 
        const created_by = authUser.user.username

        // check if there is already a task created first
        if(input.complaint_id) {

            const task_check = await tx.task.findFirst({
                where: {
                    complaint_id: input.complaint_id,
                    OR: [
                        { status: { id: TASK_STATUS.PENDING } },
                        { status: { id: TASK_STATUS.ASSIGNED } }
                    ]
                }
            })

            if(task_check) {
                return {
                    success: false,
                    msg: 'Failed to create. There is already a task created for this complaint'
                }
            }
        }

        const task_ref_number = await generateReferenceNumber({
            db_entity: DB_ENTITY.TASK,
            tx: tx as unknown as Prisma.TransactionClient
        })

        let description = ''
        let task_assignment: Prisma.TaskAssignmentCreateWithoutTaskInput | null = null

        // create task assignment 
        if(input.complaint_id) {

            console.log('has complaint id');

            const complaint = await tx.complaint.findUnique({
                where: {
                    id: input.complaint_id
                },
                select: {
                    id: true,
                    complaint_status_id: true,
                    description: true,
                    assigned_group_id: true,
                    assigned_group_type: true,
                }
            })

            console.log('complaint', complaint);

            description = complaint.description
            task_assignment = {
                created_by
            }

            if(complaint.assigned_group_type === ASSIGNED_GROUP_TYPE.AREA) {
                task_assignment.area = { connect: { id: complaint.assigned_group_id } }
            } else if(complaint.assigned_group_type === ASSIGNED_GROUP_TYPE.DIVISION) {
                task_assignment.division_id = complaint.assigned_group_id
            } else if(complaint.assigned_group_type === ASSIGNED_GROUP_TYPE.DEPARTMENT) {
                task_assignment.department_id = complaint.assigned_group_id
            }

            if(complaint.complaint_status_id === COMPLAINT_STATUS.ESCALATED) {
                await this.complaintService.update_status({
                    input: {
                        complaint_id: complaint.id,
                        complaint_status_id: COMPLAINT_STATUS.PENDING,
                        remarks: `System: A new task has been created by ${ created_by }`
                    },
                    authUser,
                    tx
                })
            }
        }

        console.log('task_assignment', task_assignment);

        const status_id = input.assignee_id ? TASK_STATUS.ASSIGNED : TASK_STATUS.PENDING

        // create task
        const task_created = await tx.task.create({
            data: {
                complaint: input.complaint_id ? { connect: { id: input.complaint_id } } : null,
                assignee_id: input.assignee_id || null,
                ref_number: task_ref_number,
                description,
                remarks: '',
                action_taken: '',
                created_by: created_by,
                status: { connect: { id: status_id } },
                logs: {
                    create: {
                        task_status_id: status_id,
                        remarks: input.remarks || null,
                        created_by,
                    }
                },
                task_assignment: task_assignment ? { create: task_assignment } : undefined,
            },
            include: {
                status: true,
                activity: true,
            },
        })

        console.log('task_created', task_created)
        
        return {
            success: true,
            msg: 'Task successfully created!',
            task: task_created
        }

    }

    async update_task(payload: {
        input: UpdateTaskInput;
        tx: Prisma.TransactionClient;
    }): Promise<{ success: boolean; msg: string; task?: Task }> {

        const { input, tx } = payload;

        const existingTask = await tx.task.findUnique({
            where: {
                id: input.task_id
            },
            select: {
                files: true,
                complaint: {
                    select: {
                        complaint_detail: {
                            select: {
                                barangay_id: true,
                            }
                        }
                    }
                }
            }
        })

        console.log('existingTask', existingTask);

        if(existingTask.files.length > 0) {
            console.log('has existing files');
            const filepaths_to_delete = existingTask.files.map(i => i.source_path)
            console.log('filepaths_to_delete', filepaths_to_delete);
            await this.deleteFiles(filepaths_to_delete)
        }


        await this.create_or_update_task_details({ 
            input, 
            barangay_id: existingTask.complaint.complaint_detail.barangay_id 
        }, tx)


        // Update task
        const updated_task = await tx.task.update({
            where: { id: input.task_id },
            data: {
                activity: input.activity_id ? { connect: { id: input.activity_id } } : undefined,
                description: input.description,
                accomplishment_qty: input.accomplishment_qty,
                action_taken: input.action_taken,
                remarks: input.remarks,
                acted_at: new Date(input.acted_at),
                files: {
                    deleteMany: {},
                    create: input.attachments.map(i => {
                        return {
                            filename: i.filename,
                            source_path: i.src
                        }
                    })
                }
            },
            include: {
                status: true,
                activity: true,
                task_assignment: {
                    include: {
                        area: true
                    }
                },
                task_detail_kwh_meter: {
                    include: {
                        linemen_incharge: true,
                    }
                },
                task_detail_power_interruption: {
                    include: {
                        linemen_incharge: true,
                    }
                },
                task_detail_line_services: {
                    include: {
                        linemen_incharge: true,
                    }
                },
                task_detail_dles: {
                    include: {
                        linemen_incharge: true,
                    }
                },
                task_detail_lmdga: {
                    include: {
                        linemen_incharge: true,
                    }
                },
            },
        });

        console.log('updated_task', updated_task);

        return {
            success: true,
            msg: 'Task successfully updated!',
            task: updated_task,
        };

    }

    private async create_or_update_task_details(payload: { 
        input: UpdateTaskInput,
        barangay_id: string,
    }, tx: Prisma.TransactionClient): Promise<void> {
        
        const { input, barangay_id } = payload

        if (input.kwh_meter) {
            await this.kwhMeterService.create_or_update({
                data: {...input.kwh_meter, barangay_id},
                task_id: input.task_id,
            }, tx);
        } else if (input.power_interruption) {
            await this.powerInterruptionService.create_or_update({
                data: {...input.power_interruption, barangay_id},
                task_id: input.task_id,
            }, tx);
        } else if (input.line_services) {
            await this.lineServicesService.create_or_update({
                data: {...input.line_services, barangay_id},
                task_id: input.task_id,
            }, tx);
        } else if (input.dles) {
            await this.dlesService.create_or_update({
                data: {...input.dles, barangay_id},
                task_id: input.task_id,
            }, tx);
        } else if (input.lmdga) {
            await this.lmdgaService.create_or_update({
                data: {...input.lmdga, barangay_id},
                task_id: input.task_id,
            }, tx);
        }
    }

    async assign_task(payload: {
        input: AssignTaskInput,
        authUser: AuthUser,
        tx: Prisma.TransactionClient,
    }): Promise<{
        success: boolean,
        msg: string,
        task?: Task
    }> {

        const { input, tx, authUser } = payload 
        const { task_id, assignee_id, remarks, will_start } = input

        // check first if task is already assigned
        const task = await tx.task.findUnique({
            select: {
                assignee_id: true,
            },
            where: { id: input.task_id }
        })

        if(!!task.assignee_id) {
            return {
                success: false,
                msg: 'Task is already assigned'
            }
        }

        // assign task
        const updated_task = await tx.task.update({
            where: { id: task_id },
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
            },
            data: {
                assignee_id,
            }
        })

        // update status
        if(will_start) {
            const updated_task_status = await this.update_status({
                input: {
                    task_status_id: TASK_STATUS.ONGOING,
                    task_id: task_id,
                    remarks,
                },
                authUser,
                tx: tx as unknown as Prisma.TransactionClient
            })

            updated_task.status = {...updated_task_status.status}
            updated_task.task_status_id = updated_task_status.task_status_id

        } else {
            console.log('1');
            const updated_task_status = await this.update_status({
                input: {
                    task_status_id: TASK_STATUS.ASSIGNED,
                    task_id: task_id,
                    remarks,
                },
                authUser,
                tx: tx as unknown as Prisma.TransactionClient
            })

            updated_task.status = {...updated_task_status.status}
            updated_task.task_status_id = updated_task_status.task_status_id

        }

        console.log('updated_task', updated_task);

        return {
            success: true,
            msg: 'Task successfully assigned!',
            task: updated_task
        }

    }

    async update_status(payload: {
        input: UpdateTaskStatusInput,
        should_update_complaint_status?: boolean,
        authUser: AuthUser,
        tx: Prisma.TransactionClient
    }): Promise<TaskEntity> {

        const { input, should_update_complaint_status = true, authUser, tx } = payload
        const { task_status_id, task_id, remarks } = input

        // create log
        await tx.taskLog.create({ 
            data: {
                task: { connect: { id: task_id } },
                status: { connect: { id: task_status_id } },
                remarks: remarks || null,
                created_by: authUser.user.username,
            } 
        })

        // update status
        const task = await tx.task.update({
            where: { id: task_id },
            include: {
                status: true,
                activity: true,
                task_assignment: {
                    include: {
                        area: true,
                    }
                }
            },
            data: {
                status: { connect: { id: task_status_id } }
            }
        })
        
        // update complaint status
        if(should_update_complaint_status) {
            await this.on_task_status_update({ task, authUser, tx: tx as unknown as Prisma.TransactionClient })
        }

        return task as unknown as TaskEntity

    }

    async on_task_status_update(payload: {
        task: Task,
        authUser: AuthUser,
        tx: Prisma.TransactionClient
    }): Promise<void> {
        const { task, authUser, tx } = payload;
        
        // update complaint status
        const statusMap = {
            [TASK_STATUS.ONGOING]: {
                complaint_status_id: COMPLAINT_STATUS.IN_PROGRESS,
                remarks: 'System: The assignee marked the task as ongoing',
            },
            [TASK_STATUS.COMPLETED]: {
                complaint_status_id: COMPLAINT_STATUS.FOR_REVIEW,
                remarks: 'System: The assignee marked the task as completed',
            },
            [TASK_STATUS.UNRESOLVED]: {
                complaint_status_id: COMPLAINT_STATUS.FOR_REVIEW,
                remarks: 'System: The assignee marked the task as unresolved',
            },
        };
    
        const updateData = statusMap[task.task_status_id];
        if (updateData) {
            await this.complaintService.update_status({
                input: {
                    complaint_status_id: updateData.complaint_status_id,
                    complaint_id: task.complaint_id,
                    remarks: updateData.remarks,
                },
                authUser,
                tx,
            });
        }
    }

    async get_task(payload: { id: number; with_task_details?: boolean }): Promise<Task> {
        const { id, with_task_details } = payload;
    
        return await this.prisma.task.findUnique({
            where: { id },
            include: {
                status: true,
                complaint: {
                    include: {
                        complaint_detail: {
                            include: {
                                barangay: {
                                    include: {
                                        municipality: true,
                                    },
                                },
                                sitio: true,
                            },
                        },
                        report_type: true,
                        status: true,
                        logs: {
                            include: {
                                status: true
                            }
                        }
                    },
                },
                ...(!!with_task_details && {
                    logs: {
                        include: {
                            status: true,
                        },
                    },
                    task_assignment: {
                        include: {
                            area: true,
                        }
                    },
                    files: true,
                    activity: {
                        include: {
                            unit: true,
                            category: true,
                        }
                    },
                    task_detail_power_interruption: {
                        include: {
                            linemen_incharge: {
                                include: {
                                    lineman: true
                                }
                            },
                            equipment_failed: true,
                            cause: true,
                            barangay: true,
                            feeder: true,
                            weather_condition: true,
                            device: true,
                        },
                    },
                    task_detail_kwh_meter: {
                        include: {
                            linemen_incharge: {
                                include: {
                                    lineman: true
                                }
                            },
                            barangay: true,
                            cause: true,
                            meter_brand: true,
                        },
                    },
                    task_detail_line_services: {
                        include: {
                            cause: true,
                            barangay: true,
                            linemen_incharge: {
                                include: {
                                    lineman: true
                                }
                            },
                        },
                    },
                    task_detail_dles: {
                        include: {
                            cause: true,
                            barangay: true,
                            linemen_incharge: {
                                include: {
                                    lineman: true
                                }
                            },
                        },
                    },
                    task_detail_lmdga: {
                        include: {
                            feeder: true,
                            barangay: true,
                            linemen_incharge: {
                                include: {
                                    lineman: true
                                }
                            },
                        },
                    },
                }),
            },
        });
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
                        linemen_incharge: true,
                        feeder: true,
                        weather_condition: true,
                        device: true,
                    }
                },
                task_detail_kwh_meter: {
                    include: {
                        linemen_incharge: true,
                        meter_brand: true,
                    }
                },
                task_detail_line_services: {
                    include: {
                        linemen_incharge: true,
                    }
                },
                task_detail_dles: {
                    include: {
                        linemen_incharge: true,
                    }
                },
                task_detail_lmdga: {
                    include: {
                        linemen_incharge: true,
                    }
                }
            }
        })
    }

    async get_pending_tasks_by_group(payload: { authUser: AuthUser }): Promise<Task[]> {
        const { authUser } = payload;
        const employee = authUser.user.user_employee?.employee;
    
        if (!employee) return [];
    
        // Check if user is a lineman first
        const lineman = await this.prisma.lineman.findFirst({
            select: { area_id: true },
            where: { employee_id: employee.id },
        });
    
        if (lineman?.area_id) {
            return this.prisma.task.findMany({
                include: { status: true },
                where: {
                    task_status_id: TASK_STATUS.PENDING,
                    task_assignment: { is: { area_id: lineman.area_id } },
                },
            });
        }
    
        // Fetch non-lineman roles
        const area = await this.prisma.area.findUnique({ where: { oic_id: employee.id } });
    
        const orConditions: any[] = [];
    
        if (area?.id) {
            orConditions.push({ task_assignment: { is: { area_id: area.id } } });
        }
    
        if (employee.division_id) {
            orConditions.push({ task_assignment: { is: { division_id: employee.division_id } } });
        }
    
        if (employee.department_id) {
            orConditions.push({ task_assignment: { is: { department_id: employee.department_id } } });
        }
    
        if (orConditions.length === 0) return [];
    
        // Fetch tasks and ensure uniqueness
        const tasks = await this.prisma.task.findMany({
            include: { status: true },
            where: {
                task_status_id: TASK_STATUS.PENDING,
                OR: orConditions,
            },
        });
    
        // Use a Set to remove duplicates based on task ID
        const uniqueTasks = Array.from(new Map(tasks.map(task => [task.id, task])).values());
    
        return uniqueTasks;
    }

    async delete_task(payload: { 
        task_id: number, 
    }, tx: Prisma.TransactionClient) {

        console.log('delete task', payload);
        const { task_id } = payload

        const task = await tx.task.delete({
            where: { id: task_id }
        })

        console.log('task deleted', task);

        return task

    }

    async get_existing_task(payload: { task_id: number }, tx: Prisma.TransactionClient): Promise<Task> {

        const { task_id } = payload 

        const existing_task = await tx.task.findUnique({
            where: { id: task_id },
            include: {
                status: true,
                activity: true,
                task_detail_kwh_meter: {
                    include: {
                        linemen_incharge: true,
                    }
                },
                task_detail_power_interruption: {
                    include: {
                        linemen_incharge: true,
                    }
                },
                task_detail_line_services: {
                    include: {
                        linemen_incharge: true,
                    }
                },
                task_detail_dles: {
                    include: {
                        linemen_incharge: true,
                    }
                },
                task_detail_lmdga: {
                    include: {
                        linemen_incharge: true,
                    }
                },
            }
        })

        if(!existing_task) {
            throw new NotFoundException('Task not found with id ' + task_id)
        }

        return existing_task

    }

    private async deleteFiles(filePaths: string[]) {

        const url = process.env.API_URL + '/api/v1/file-upload/powerserve/task'

        return axios.delete(url, { data: filePaths });
    }

}
