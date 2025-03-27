import { Injectable, NotFoundException } from '@nestjs/common';
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
                        created_by: 'system',
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
                msg: 'Failed to created complaint!'
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
                                linemen: true,
                                feeder: true,
                                weather_condition: true,
                                device: true,
                            }
                        },
                        task_detail_kwh_meter: {
                            include: {
                                linemen: true,
                                meter_brand: true,
                            }
                        },
                        task_detail_line_services: {
                            include: {
                                linemen: true,
                            }
                        },
                        task_detail_dles: {
                            include: {
                                linemen: true,
                            }
                        },
                        task_detail_lmdga: {
                            include: {
                                linemen: true,
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
