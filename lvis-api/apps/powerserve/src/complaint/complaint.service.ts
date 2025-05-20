import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { MutationComplaintResponse } from './entities/mutation-complaint-response';
import { CreateComplaintInput } from './dto/create-complaint.input';
import { generateReferenceNumber } from '../__common__/helpers';
import { Complaint, Prisma } from 'apps/powerserve/prisma/generated/client';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { ASSIGNED_GROUP_TYPE, COMPLAINT_STATUS } from './entities/constants';
import { DB_ENTITY } from '../__common__/constants';
import { TASK_STATUS } from '../task/entities/constants';
import { FindAllComplaintResponse } from './entities/find-all-response';
import { endOfYear, startOfYear } from 'date-fns';
import { getDateRange } from 'libs/utils';
import { Complaint as ComplaintEntity } from "./entities/complaint.entity";
import { UpdateComplaintStatusInput } from './dto/update-complaint-status.input';
import { DB_TABLE } from '../__common__/types';
import { UpdateComplaintInput } from './dto/update-complaint.input';
import { TaskService } from '../task/task.service';
import { ComplaintEventListeners } from './complaint.event-listener';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ComplaintCreatedEvent, ComplaintEvents } from './events/complaint.events';

@Injectable()
export class ComplaintService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
        @Inject(forwardRef(() => TaskService))
        private readonly taskService: TaskService,
        private readonly complaintEventListeners: ComplaintEventListeners,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async create_complaint_transaction(payload: {
        input: CreateComplaintInput,
        metadata: {
            ip_address: string, 
            device_info: any,
            authUser: AuthUser,
        }
    }): Promise<MutationComplaintResponse> {
        const { input, metadata } = payload
        const { ip_address, device_info, authUser } = metadata

        const result = await this.prisma.$transaction(async(tx) => {

            const { success, msg, data } = await this.create_complaint({ input, authUser }, tx as unknown as Prisma.TransactionClient)

            if(success && data) {

                await this.audit.createAuditEntry({
                    username: authUser.user.username,
                    table: DB_TABLE.COMPLAINT,
                    action: 'CREATE-COMPLAINT',
                    reference_id: data.ref_number,
                    metadata: data,
                    ip_address: ip_address,
                    device_info: device_info
                }, tx as unknown as Prisma.TransactionClient)

                this.eventEmitter.emit(
                    ComplaintEvents.ON_COMPLAINT_CREATED,
                    new ComplaintCreatedEvent(data, authUser)
                )
    
                return { success, msg, data }

            }

            return { success, msg }


        })

        return result
    }

    async create_complaint(payload: {
        input: CreateComplaintInput,
        authUser: AuthUser
    }, tx: Prisma.TransactionClient): Promise<MutationComplaintResponse> {

        const { input, authUser } = payload 

        const complaint_ref_number = await generateReferenceNumber({
            db_entity: DB_ENTITY.COMPLAINT,
            tx: tx as unknown as Prisma.TransactionClient
        })

        const task_ref_number = await generateReferenceNumber({
            db_entity: DB_ENTITY.TASK,
            tx: tx as unknown as Prisma.TransactionClient
        })

        let assigned_group_type = ASSIGNED_GROUP_TYPE.AREA
        let assigned_group_id = ''

        if(input.area_id) {
            assigned_group_type = ASSIGNED_GROUP_TYPE.AREA
            assigned_group_id = input.area_id
        } else if(input.department_id) {
            assigned_group_type = ASSIGNED_GROUP_TYPE.DEPARTMENT
            assigned_group_id = input.department_id
        } else if(input.division_id) {
            assigned_group_type = ASSIGNED_GROUP_TYPE.DIVISION
            assigned_group_id = input.division_id
        }

        const data: Prisma.ComplaintCreateInput = {
            report_type: { connect: { id: input.report_type_id } },
            status: { connect: { id: COMPLAINT_STATUS.PENDING } },
            ref_number: complaint_ref_number,
            complainant_name: input.complainant_name,
            complainant_contact_no: input.complainant_contact_no,
            description: input.description,
            remarks: input.remarks,
            created_by: authUser.user.username,
            assigned_group_id,
            assigned_group_type,
            complaint_detail: {
                create: {
                    consumer_id: input.complaint_detail.consumer_id || null,
                    barangay: { connect: { id: input.complaint_detail.barangay_id } },
                    sitio: input.complaint_detail.sitio_id ? { connect: { id: input.complaint_detail.sitio_id } } : undefined,
                    landmark: input.complaint_detail.landmark || null
                }
            },
            logs: {
                create: {
                    remarks: input.remarks,
                    created_by: authUser.user.username,
                    status: { connect: { id: COMPLAINT_STATUS.PENDING } },
                }
            },
            tasks: {
                create: {
                    ref_number: task_ref_number,
                    remarks: '',
                    action_taken: '',
                    created_by: 'system',
                    description: input.description,
                    task_status_id: TASK_STATUS.PENDING,
                    task_assignment: {
                        create: {
                            area: input.area_id ? { connect: { id: input.area_id } } : undefined,
                            department_id: input.department_id || undefined,
                            division_id: input.division_id || undefined,
                            created_by: 'system'
                        }
                    },
                    logs: {
                        create: {
                            remarks: 'System: Automatically generated upon complaint creation',
                            created_by: 'system',
                            status: { connect: { id: TASK_STATUS.PENDING } },
                        }
                    }
                }
            },
        }

        const created = await tx.complaint.create({
            data
        })

       return {
            success: true,
            msg: 'Complaint successfully created!',
            data: created as unknown as ComplaintEntity,
        }

    }

    async update(payload: {
        input: UpdateComplaintInput,
        metadata: {
            ip_address: string, 
            device_info: any,
            authUser: AuthUser,

        }
    }) {

        const complaint = await this.prisma.$transaction(async(tx) => {

            const { input, metadata } = payload 
            const authUser = metadata.authUser

            const existingComplaint = await tx.complaint.findUnique({
                where: { id: input.complaint_id },
                include: {
                    complaint_detail: true,
                    tasks: true,
                }
            })

            if(!existingComplaint) {
                throw new NotFoundException('Complaint not found with id of ' + input.complaint_id)
            }

            // assigned group is updated
            // cannot update if there is already an active task (assigned / ongoing)
            if(input.assigned_group_type !== existingComplaint.assigned_group_type && input.assigned_group_id !== existingComplaint.assigned_group_id) {
                
                const has_active_task = existingComplaint.tasks.find(i => i.task_status_id === TASK_STATUS.ASSIGNED || i.task_status_id === TASK_STATUS.ONGOING)

                if(has_active_task) {
                    throw new BadRequestException('Unable to update assigned group. There is already an active task')
                }

            }

            const data: Prisma.ComplaintUpdateInput = {
                report_type: { connect: { id: input.report_type_id } },
                complainant_name: input.complainant_name,
                complainant_contact_no: input.complainant_contact_no,
                description: input.description,
                remarks: input.remarks,
                assigned_group_id: input.assigned_group_id,
                assigned_group_type: input.assigned_group_type,
                complaint_detail: {
                    update: {
                        consumer_id: input.complaint_detail.consumer_id || null,
                        barangay: { connect: { id: input.complaint_detail.barangay_id } },
                        sitio: input.complaint_detail.sitio_id ? { connect: { id: input.complaint_detail.sitio_id } } : undefined,
                        landmark: input.complaint_detail.landmark || null
                    }
                },
                logs: {
                    create: {
                        remarks: 'System: Complaint updated. Old and new data can be requested from the system admin',
                        created_by: authUser.user.username,
                        status: { connect: { id: existingComplaint.complaint_status_id } }  
                    }
                }
            }

            const updated = await tx.complaint.update({
                where: { id: input.complaint_id },
                data,
                include: {
                    complaint_detail: true,
                }
            })

            // update task assignment base on complaint assigned group. 
            // Only update pending tasks
            for(let task of existingComplaint.tasks) {

                if(task.task_status_id !== TASK_STATUS.PENDING) {
                    continue
                }

                if(input.assigned_group_type === ASSIGNED_GROUP_TYPE.AREA) {

                    await tx.taskAssignment.update({
                        where: { task_id: task.id },
                        data: {
                            area: { connect: { id: input.assigned_group_id } },
                            department_id: null,
                            division_id: null,
                        }
                    })

                } else if(input.assigned_group_type === ASSIGNED_GROUP_TYPE.DIVISION) {
                    await tx.taskAssignment.update({
                        where: { task_id: task.id },
                        data: {
                            area: { disconnect: true },
                            department_id: null,
                            division_id: input.assigned_group_id,
                        }
                    })

                }  else if(input.assigned_group_type === ASSIGNED_GROUP_TYPE.DEPARTMENT) {
                    await tx.taskAssignment.update({
                        where: { task_id: task.id },
                        data: {
                            area: { disconnect: true },
                            department_id: input.assigned_group_id,
                            division_id: null,
                        }
                    })
                }

            }

            // remove tasks property
            delete existingComplaint.tasks

            // create audit
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.COMPLAINT,
                action: 'UPDATE-COMPLAINT',
                reference_id: updated.ref_number,
                metadata: {
                    'old_value': existingComplaint,
                    'new_value': updated
                },
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)

            return updated

        })

        if(complaint) {
            return {
                success: true,
                msg: 'Complaint successfully updated!',
                data: complaint as unknown as ComplaintEntity,
            }
        } else {
            return {
                success: false,
                msg: 'Failed to update complaint!'
            }
        }

    }

    async findAll(payload: {
        page: number, 
        pageSize: number, 
        created_at?: string,
        complaint_status_id?: number,
        complainant_name?: string,
        description?: string,
        assigned_group_id?: string,
    }): Promise<FindAllComplaintResponse> {
    
        const { page, pageSize, created_at, ...filters } = payload;
        const skip = (page - 1) * pageSize;
    
        let whereCondition: Prisma.ComplaintWhereInput = {};
    
        // Date filter
        if (created_at) {
            const { startDate, endDate } = getDateRange(created_at);
            whereCondition.created_at = {
                gte: startDate,
                lte: endDate,
            };
        } else {
            // Default to current year's records if no date filter is provided
            const startOfYearDate = startOfYear(new Date());
            const endOfYearDate = endOfYear(new Date());
            whereCondition.created_at = {
                gte: startOfYearDate,
                lte: endOfYearDate,
            };
        }
    
        // Add other filters
        if (filters.complaint_status_id) {
            whereCondition.complaint_status_id = filters.complaint_status_id;
        }
    
        if (filters.complainant_name) {
            whereCondition.complainant_name = {
                contains: filters.complainant_name,
                mode: 'insensitive' // case insensitive search
            };
        }
    
        if (filters.description) {
            whereCondition.description = {
                contains: filters.description,
                mode: 'insensitive'
            };
        }
    
        if (filters.assigned_group_id) {
            whereCondition.assigned_group_id = filters.assigned_group_id;
        }
    
        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.complaint.findMany({
                include: {
                    report_type: true,
                    status: true,
                },
                where: whereCondition,
                orderBy: {
                    ref_number: 'desc',
                },
                skip,
                take: pageSize,
            }),
            this.prisma.complaint.count({
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

    async findBy(payload: { id?: number, ref_number?: string }): Promise<Complaint | null> {

        const { id, ref_number } = payload

        const item = await this.prisma.complaint.findFirst({
            include: {
                report_type: true,
                status: true,
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
                logs: {
                    include: {
                        status: true
                    }
                },
                tasks: {
                    include: {
                        logs: {
                            include: {
                                status: true,
                            }
                        },
                        files: true,
                        status: true,
                        task_assignment: {
                            include: {
                                area: true,
                            }
                        },
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
                    },
                    orderBy: {
                        ref_number: 'desc'
                    }
                },
            },
            where: {
                OR: [
                    { id },
                    { ref_number }
                ]
            }
        });
    
        if (!item) {
            throw new NotFoundException('Complaint not found');
        }
    
        return item;
    }

    async update_status_transaction(payload: {
        input: UpdateComplaintStatusInput,
        metadata: {
            ip_address: string, 
            device_info: any,
            authUser: AuthUser,

        },
    }): Promise<MutationComplaintResponse> {

        const { input, metadata } = payload
        const { authUser, ip_address, device_info } = metadata

        const result = await this.prisma.$transaction(async(tx) => {

            const complaint = await this.update_status({
                input,
                authUser,
                tx: tx as unknown as Prisma.TransactionClient
            })

            // create audit
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.COMPLAINT,
                action: 'UPDATE-COMPLAINT-STATUS',
                reference_id:complaint.ref_number,
                metadata: complaint,
                ip_address: ip_address,
                device_info: device_info
            }, tx as unknown as Prisma.TransactionClient)

            return complaint

        })

        if(result) {
            return {
                success: true,
                msg: 'Complaint status successfully updated!',
                data: result as unknown as ComplaintEntity,
            }
        } else {
            return {
                success: false,
                msg: 'Failed to update complaint status!'
            }
        }


    }

    async update_status(payload: {
        input: UpdateComplaintStatusInput,
        authUser: AuthUser,
        tx: Prisma.TransactionClient
    }): Promise<Complaint> {

        const { input, authUser, tx } = payload
        const { complaint_status_id, complaint_id, remarks } = input

        const created_by = authUser.user.username

        // create log
        await tx.complaintLog.create({
            data: {
                complaint: { connect: { id: complaint_id } },
                status: { connect: { id: complaint_status_id } },
                remarks: remarks || null,
                created_by,
            }
        })

        // update status
        const complaint = await tx.complaint.update({
            where: { id: complaint_id },
            include: {
                status: true,
                logs: {
                    include: {
                        status: true
                    }
                }
            },
            data: {
                status: { connect: { id: complaint_status_id } }
            }
        })

        if(input.complaint_status_id === COMPLAINT_STATUS.CANCELLED) {
            await this.on_complaint_cancelled({ complaint_id, authUser }, tx)
        }

        return complaint

    }

    async on_complaint_cancelled(payload: { complaint_id: number, authUser: AuthUser }, tx: Prisma.TransactionClient) {

        console.log('on_complaint_cancelled', payload);

        const { complaint_id, authUser } = payload 

        const complaint = await tx.complaint.findUnique({
            where: { id: complaint_id },
            select: {
                tasks: {
                    select: {
                        id: true,
                        task_status_id: true,
                    }
                }
            }
        })

        for(let task of complaint.tasks) {

            console.log('task', task);

            // delete task
            if(task.task_status_id === TASK_STATUS.PENDING) {
                console.log('task is pending');
                await this.taskService.delete_task({ task_id: task.id }, tx)
                continue
            }

            // cancel task
            if(task.task_status_id === TASK_STATUS.ASSIGNED) {
                console.log('task is assigned');
                await this.taskService.update_status({
                    input: {
                        task_status_id: TASK_STATUS.CANCELLED,
                        task_id: task.id,
                        remarks: 'System: The reference complaint has been canceled'
                    },
                    authUser,
                    tx,
                })
                continue
            }

        }

    }

    // get complaints by department, division, or area on which the employee belongs
    async get_escalated_complaints_by_group(payload: { authUser: AuthUser }) {
        const { authUser } = payload;
        const employee = authUser.user.user_employee?.employee;
    
        if (!employee) return [];
    
        const area = await this.prisma.area.findUnique({
            where: {
                oic_id: employee.id,
            },
        });
    
        const orConditions = [
            {
                assigned_group_id: employee.department_id,
                assigned_group_type: ASSIGNED_GROUP_TYPE.DEPARTMENT,
            },
        ];
    
        if (employee.division_id) {
            orConditions.push({
                assigned_group_id: employee.division_id,
                assigned_group_type: ASSIGNED_GROUP_TYPE.DIVISION,
            });
        }
    
        if (area) {
            orConditions.push({
                assigned_group_id: area.id,
                assigned_group_type: ASSIGNED_GROUP_TYPE.AREA,
            });
        }

        const complaints = await this.prisma.complaint.findMany({
            include: {
                status: true,
                logs: {
                    include: {
                        status: true,
                    }
                },
            },
            where: {
                complaint_status_id: COMPLAINT_STATUS.ESCALATED,
                OR: orConditions,
            },
        });
    
        return complaints;
    }
    
    async get_complaint_history(payload: { consumer_id: string }): Promise<Complaint[]> {

        const { consumer_id } = payload

        const items = await this.prisma.complaint.findMany({
            where: {
                complaint_detail: {
                    consumer_id
                }
            },
            select: {
                report_type: true,
                status: true,
                assigned_group_id: true,
                assigned_group_type: true,
                ref_number: true,
                complainant_name: true,
                complainant_contact_no: true,
                description: true,
                created_by: true,
                created_at: true,
                complaint_detail: {
                    select: {
                        barangay: {
                            include: {
                                municipality: true
                            }
                        },
                        sitio: true,
                        landmark: true,
                    }
                },
            },
            take: 50
        })

        return items as unknown as Complaint[]

    }

}
