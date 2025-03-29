import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class ComplaintService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService
    ) {}

    async create(payload: {
        input: CreateComplaintInput,
        metadata: {
            ip_address: string, 
            device_info: any,
            authUser: AuthUser,

        }
    }): Promise<MutationComplaintResponse> {

        const complaint = await this.prisma.$transaction(async(tx) => {

            const { input, metadata } = payload 
            const authUser = metadata.authUser

            const complaint_ref_number = await generateReferenceNumber({
                db_entity: DB_ENTITY.COMPLAINT,
                tx: tx as Prisma.TransactionClient
            })

            const task_ref_number = await generateReferenceNumber({
                db_entity: DB_ENTITY.TASK,
                tx: tx as Prisma.TransactionClient
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
                        remarks: 'System: Automatically generated upon complaint creation',
                        created_by: authUser.user.username,
                        status: { connect: { id: COMPLAINT_STATUS.PENDING } },
                    }
                },
                tasks: {
                    create: {
                        ref_number: task_ref_number,
                        remarks: '',
                        accomplishment: '',
                        action_taken: '',
                        created_by: 'system',
                        description: input.description,
                        status: { connect: { id: TASK_STATUS.PENDING } },
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

            // create audit
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.COMPLAINT,
                action: 'CREATE-COMPLAINT',
                reference_id: created.ref_number,
                metadata: created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)

            return created

        })

        if(complaint) {
            return {
                success: true,
                msg: 'Complaint successfully created!',
                data: complaint as unknown as ComplaintEntity,
            }
        } else {
            return {
                success: false,
                msg: 'Failed to create complaint!'
            }
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
                        remarks: 'Complaint updated. Old and new data can be requested from the system admin',
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
            }, tx as Prisma.TransactionClient)

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
        created_at?: string
    }): Promise<FindAllComplaintResponse> {

        const { page, pageSize, created_at } = payload

        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (created_at) {
            const { startDate, endDate } = getDateRange(created_at);

            whereCondition.date_requested = {
                gte: startDate,
                lte: endDate,
            };
        }

        // Default to current year's records if neither filter is provided
        if (!created_at) {
            const startOfYearDate = startOfYear(new Date());
            const endOfYearDate = endOfYear(new Date());

            whereCondition.created_at = {
                gte: startOfYearDate,
                lte: endOfYearDate,
            };
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
                tx: tx as Prisma.TransactionClient
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
            }, tx as Prisma.TransactionClient)

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

        return complaint

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
    
    

}
