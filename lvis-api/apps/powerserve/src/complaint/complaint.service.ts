import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

    private readonly logger = new Logger(ComplaintService.name);

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
                    complaint_detail: true,
                    logs: {
                        include: {
                            status: true
                        }
                    },
                    tasks: true,
                }
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
        created_at?: string, 
    }): Promise<FindAllComplaintResponse> {

        const { page, pageSize, created_at } = payload

        const skip = (page - 1) * pageSize;

        let whereCondition: any = {};

        if (created_at) {
            const { startDate, endDate } = getDateRange(created_at);

            whereCondition.created_at = {
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
                    nature_of_complaint: true,
                    status: true,
                    complaint_detail: true,
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
                logs: true,
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

    async updateStatus(payload: {
        input: UpdateComplaintStatusInput,
        metadata: {
            ip_address: string, 
            device_info: any,
            authUser: AuthUser,

        }
    }): Promise<MutationComplaintResponse> {

        const complaint = await this.prisma.$transaction(async(tx) => {

            const { input, metadata } = payload
            const { complaint_status_id, complaint_id, remarks } = input

            const { authUser } = metadata

            // update status
            const updated = await tx.complaint.update({
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

            // create complaint log
            const log_created = await tx.complaintLog.create({ data: log })

            // create audit
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.COMPLAINT,
                action: 'UPDATE-COMPLAINT-STATUS',
                reference_id: updated.ref_number,
                metadata: updated,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)

            return updated

        })

        if(complaint) {
            return {
                success: true,
                msg: 'Complaint status successfully updated!',
                data: complaint as unknown as ComplaintEntity,
            }
        } else {
            return {
                success: false,
                msg: 'Failed to update complaint status!'
            }
        }


    }

}
