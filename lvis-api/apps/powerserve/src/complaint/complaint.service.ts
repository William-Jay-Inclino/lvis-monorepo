import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { MutationComplaintResponse } from './entities/mutation-complaint-response';
import { CreateComplaintInput } from './dto/create-complaint.input';
import { generateReferenceNumber } from '../__common__/helpers';
import { Complaint, Prisma } from 'apps/powerserve/prisma/generated/client';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { COMPLAINT_STATUS } from './entities/constants';
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

            const complaint_detail_data: Prisma.ComplaintDetailCreateWithoutComplaintInput = {
                account_number: input.complaint_detail.account_number || null,
                meter_number: input.complaint_detail.meter_number || null,
                consumer_id: input.complaint_detail.consumer_id || null,
                barangay: { connect: { id: input.complaint_detail.barangay_id } },
                sitio: input.complaint_detail.sitio_id ? { connect: { id: input.complaint_detail.sitio_id } } : undefined,
                landmark: input.complaint_detail.landmark || null
            }

            const complaint_assignment_data: Prisma.ComplaintAssignmentCreateWithoutComplaintInput = {
                area: input.assigned_to.area_id ? { connect: { id: input.assigned_to.area_id } } : undefined,
                department_id: input.assigned_to.department_id || null,
                division_id: input.assigned_to.division_id || null,
            }

            const log: Prisma.ComplaintLogCreateWithoutComplaintInput = {
                remarks: 'Automatically generated upon complaint creation',
                created_by: 'system',
                status: { connect: { id: COMPLAINT_STATUS.PENDING } },
            }

            const task: Prisma.TaskCreateWithoutComplaintInput = {
                ref_number: task_ref_number,
                assigned_to_id: null,
                remarks: '',
                accomplishment: '',
                action_taken: '',
                created_by: 'system',
                status: { connect: { id: TASK_STATUS.PENDING } }
            }

            const data: Prisma.ComplaintCreateInput = {
                report_type: { connect: { id: input.report_type_id } },
                nature_of_complaint: { connect: { id: input.nature_of_complaint_id } },
                status: { connect: { id: COMPLAINT_STATUS.PENDING } },
                ref_number: complaint_ref_number,
                complainant_name: input.complainant_name,
                complainant_contact_no: input.complainant_contact_no,
                description: input.description,
                remarks: input.remarks,
                created_by: authUser.user.username,
                complaint_detail: {
                    create: complaint_detail_data
                },
                assigned_to: {
                    create: complaint_assignment_data
                },
                logs: {
                    create: log
                },
                tasks: {
                    create: task
                },
            }

            const created = await tx.complaint.create({
                data,
                include: {
                    report_type: true,
                    nature_of_complaint: true,
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
                    assigned_to: {
                        include: {
                            area: true,
                        }
                    },
                    logs: {
                        include: {
                            status: true
                        }
                    },
                },
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

    async findAll(): Promise<Complaint[]> {
        return await this.prisma.complaint.findMany({
            where: {
                complaint_status_id: {
                    notIn: [COMPLAINT_STATUS.CANCELLED, COMPLAINT_STATUS.CLOSED],
                },
            },
            include: {
                report_type: true,
                nature_of_complaint: true,
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
                assigned_to: {
                    include: {
                        area: true,
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
                },
            },
            orderBy: {
                ref_number: 'desc'
            }
        });
    }

    async findBy(payload: { id?: number, ref_number?: string }): Promise<Complaint | null> {

        const { id, ref_number } = payload

        const item = await this.prisma.complaint.findFirst({
            include: {
                report_type: true,
                nature_of_complaint: true,
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
                assigned_to: {
                    include: {
                        area: true,
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

        // update status
        const complaint = await tx.complaint.update({
            where: { id: complaint_id },
            data: {
                status: { connect: { id: complaint_status_id } }
            }
        })

        const log: Prisma.ComplaintLogCreateInput = {
            complaint: { connect: { id: complaint_id } },
            status: { connect: { id: complaint_status_id } },
            remarks,
            created_by: authUser.user.username,
        }

        // create log
        await tx.complaintLog.create({ data: log })

        return complaint

    }

}
