import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Lineman as LinemanEntity } from './entities/lineman.entity';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { CreateLinemanInput } from './dto/create-lineman.input';
import { MutationLinemanResponse } from './entities/mutation-lineman-response';
import { Lineman, LinemanStatus, Prisma, Remarks } from 'apps/powerserve/prisma/generated/client';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { DB_TABLE } from '../__common__/types';
import { UpdateLinemanInput } from './dto/update-lineman.input';
import { TASK_STATUS } from '../task/entities/constants';
import { LinemanTask } from './entities/lineman-task';
import { get_numerical_rating, get_remarks } from './helpers/lineman.helpers';
import { LinemanActivity } from './entities/lineman-activity';
import { PowerInterruptionLineman } from '../td_power_interruption_lineman/entities/power_interruption_lineman.entity';
import { KwhMeterLineman } from '../td_kwh_meter_lineman/entities/kwh_meter_lineman.entity';
import { LineServicesLineman } from '../td_line_services_lineman/entities/line_services_lineman.entity';
import { DlesLineman } from '../td_dles_lineman/entities/dles_lineman.entity';
import { LmdgaLineman } from '../td_lmdga_lineman/entities/lmdga_lineman.entity';
import { endOfDay, parseISO, startOfDay } from 'date-fns';

@Injectable()
export class LinemanService {

    private readonly logger = new Logger(LinemanService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
    ) { }

    async create(
        input: CreateLinemanInput, 
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<MutationLinemanResponse> {

        const authUser = metadata.authUser

        const existingLineman = await this.prisma.lineman.findUnique({
            where: { employee_id: input.employee_id },
        });
    
        if (existingLineman) {
            return { success: false, msg: 'Employee is already a lineman' }
        }
        
        return await this.prisma.$transaction(async(tx) => {

            const created = await tx.lineman.create({
                data: {
                    employee_id: input.employee_id,
                    area: { connect: { id: input.area_id } },
                    supervisor_id: input.supervisor_id,
                    status: LinemanStatus.ACTIVE,
                },
                include: { area: true }
            })

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.LINEMAN,
                action: 'CREATE-LINEMAN',
                reference_id: created.id,
                metadata: created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Lineman successfully created!',
                data: created
            }

        })


    }

    async update(
        id: string,
        input: UpdateLinemanInput, 
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<MutationLinemanResponse> {

        const authUser = metadata.authUser

        const existingLineman = await this.prisma.lineman.findUnique({
            where: { id },
            include: { area: true }
        });
    
        if (!existingLineman) {
            throw new NotFoundException('Lineman not found with id ' + id)
        }
        
        return await this.prisma.$transaction(async(tx) => {

            const updated = await tx.lineman.update({
                where: { id },
                data: {
                    area: { connect: { id: input.area_id } },
                    supervisor_id: input.supervisor_id
                },
                include: { area: true }
            })

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.LINEMAN,
                action: 'UPDATE-LINEMAN',
                reference_id: id,
                metadata: {
                    'old_value': existingLineman,
                    'new_value': updated
                },
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Lineman successfully updated!',
                data: updated
            }

        })

    }

    async findAll(payload: { 
        area_id?: string,
        with_schedule?: boolean,
        status?: LinemanStatus | Prisma.EnumLinemanStatusFilter,
    }): Promise<Lineman[]> {  
        const { area_id, with_schedule, status } = payload;
    
        // Convert simple status string to Prisma filter if needed
        const statusFilter = typeof status === 'string' ? { equals: status } : status;
    
        const where: Prisma.LinemanWhereInput = {
            AND: [
                area_id ? { area_id } : undefined,
                statusFilter ? { status: statusFilter } : undefined,
            ].filter(Boolean),
        };
    
        const items = await this.prisma.lineman.findMany({
            where,
            include: {
                area: true,
                schedule: with_schedule ? {
                    include: {
                        general_shift: true,
                        mon_shift: true,
                        tue_shift: true,
                        wed_shift: true,
                        thu_shift: true,
                        fri_shift: true,
                        sat_shift: true,
                        sun_shift: true,
                    }
                } : false,
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    
        return items;
    }

    async findOne(id: string): Promise<Lineman | null> {
        
        try {
            
            const item = await this.prisma.lineman.findUnique({
                where: { id },
                include: {
                    area: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Lineman not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() lineman', error)
        }

    }

    async get_all_lineman_by_current_user(payload: { authUser: AuthUser }): Promise<Lineman[]> {

        const { authUser } = payload

        if(!authUser.user.user_employee) {
            return []
        }

        const employee = authUser.user.user_employee.employee

        const area = await this.prisma.area.findUnique({ where: { oic_id: employee.id } })

        // is area head
        if(area) {

            return await this.prisma.lineman.findMany({
                where: {
                    OR: [
                        { area_id: area.id },
                        { supervisor_id: employee.id }
                    ]
                } 
            })

        }

        return []

    }

    async remove(
        id: string,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
      ): Promise<MutationLinemanResponse> {
        const { authUser, ip_address, device_info } = metadata;
      
        try {
          return await this.prisma.$transaction(async (tx) => {
            // Check if lineman exists
            const linemanExists = await tx.lineman.findUnique({
              where: { id },
              select: { id: true }
            });
      
            if (!linemanExists) {
              return { success: false, msg: "Lineman not found" };
            }
      
            const relationChecks = await Promise.all([
              tx.powerInterruptionLineman.findFirst({ where: { lineman_id: id }, select: { id: true } }),
              tx.kwhMeterLineman.findFirst({ where: { lineman_id: id }, select: { id: true } }),
              tx.lineServicesLineman.findFirst({ where: { lineman_id: id }, select: { id: true } }),
              tx.dlesLineman.findFirst({ where: { lineman_id: id }, select: { id: true } }),
              tx.lmdgaLineman.findFirst({ where: { lineman_id: id }, select: { id: true } }),
            ]);
      
            const hasRelations = relationChecks.some((relation) => relation !== null);
      
            if (hasRelations) {
              return {
                success: false,
                msg: "Unable to delete: Lineman has existing records"
              };
            }
      
            // Proceed with deletion
            const deletedItem = await tx.lineman.delete({
              where: { id },
              include: { area: true }
            });
      
            // Audit log
            await this.audit.createAuditEntry(
              {
                username: authUser.user.username,
                table: DB_TABLE.LINEMAN,
                action: "DELETE-LINEMAN",
                reference_id: id,
                metadata: deletedItem,
                ip_address,
                device_info
              },
              tx as unknown as Prisma.TransactionClient
            );
      
            return { success: true, msg: "Lineman successfully deleted" };
          });
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return { success: false, msg: "Database error during deletion" };
          }
          throw error;
        }
    }
    
    async get_lineman_activities(
        payload: { start_date: string; end_date: string; employee_id?: string }
    ): Promise<Lineman[]> {
        const { start_date, end_date, employee_id } = payload;

        // Parse and validate dates
        const startDate = startOfDay(parseISO(start_date));
        const endDate = endOfDay(parseISO(end_date));

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date format. Please use YYYY-MM-DD format');
        }

        // 1. Define reusable select structure
        const activitySelect = {
            select: {
                task_detail: {
                    select: {
                        barangay: true,
                        distance_travel_in_km: true,
                        task: {
                            select: {
                                id: true,
                                ref_number: true,
                                acted_at: true,
                                accomplishment_qty: true,
                                status: true,
                                activity: {
                                    select: {
                                        unit: true,
                                        name: true,
                                        code: true,
                                        quantity: true,
                                        num_of_personnel: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };

        // 2. Common query conditions
        const commonCondition = {
            task_detail: {
                task: {
                    acted_at: { 
                        gte: startDate, 
                        lte: endDate 
                    },
                    task_status_id: { 
                        in: [TASK_STATUS.COMPLETED, TASK_STATUS.UNRESOLVED] 
                    },
                },
            },
        };

        // 3. Single optimized database query with proper filtering
        const [linemen, remarks] = await Promise.all([
            this.prisma.lineman.findMany({
                where: {
                    ...(employee_id && { employee_id }),
                    OR: [
                        { power_interruptions: { some: commonCondition } },
                        { kwh_meters: { some: commonCondition } },
                        { line_services: { some: commonCondition } },
                        { dles: { some: commonCondition } },
                        { lmdgas: { some: commonCondition } },
                    ],
                },
                include: {
                    area: true,
                    power_interruptions: {
                        ...activitySelect,
                        where: {
                            task_detail: {
                                task: {
                                    acted_at: { 
                                        gte: startDate, 
                                        lte: endDate 
                                    },
                                },
                            },
                        },
                    },
                    kwh_meters: {
                        ...activitySelect,
                        where: {
                            task_detail: {
                                task: {
                                    acted_at: { 
                                        gte: startDate, 
                                        lte: endDate 
                                    },
                                },
                            },
                        },
                    },
                    line_services: {
                        ...activitySelect,
                        where: {
                            task_detail: {
                                task: {
                                    acted_at: { 
                                        gte: startDate, 
                                        lte: endDate 
                                    },
                                },
                            },
                        },
                    },
                    dles: {
                        ...activitySelect,
                        where: {
                            task_detail: {
                                task: {
                                    acted_at: { 
                                        gte: startDate, 
                                        lte: endDate 
                                    },
                                },
                            },
                        },
                    },
                    lmdgas: {
                        ...activitySelect,
                        where: {
                            task_detail: {
                                task: {
                                    acted_at: { 
                                        gte: startDate, 
                                        lte: endDate 
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    area_id: 'asc'
                }
            }),
            this.prisma.remarks.findMany(),
        ]);

        // 4. Process results with additional date validation
        return linemen.map(lineman => {
            const activities: LinemanActivity[] = [];
            let totals = { standard: 0, accomplishment: 0, distance: 0 };

            // Helper to process activity arrays
            const processActivities = (items: any[]) => {
                items.forEach(({ task_detail }) => {
                    if (!task_detail?.task) return;
                    
                    const taskDate = new Date(task_detail.task.acted_at);
                    if (taskDate < startDate || taskDate > endDate) return;
                    
                    const { task, barangay, distance_travel_in_km } = task_detail;
                    const numerical_rating = get_numerical_rating({
                        standard_qty: task.activity.quantity,
                        accomplishment_qty: task.accomplishment_qty,
                    });

                    activities.push({
                        acted_at: task.acted_at,
                        created_at: task.created_at,
                        activity: task.activity,
                        accomplishment_qty: task.accomplishment_qty,
                        barangay,
                        task,
                        numerical_rating,
                        remarks: get_remarks({ numerical_rating, remarks }) as unknown as Remarks,
                        distance_travelled_in_km: distance_travel_in_km,
                    });

                    totals.standard += task.activity.quantity;
                    totals.accomplishment += task.accomplishment_qty;
                    totals.distance += distance_travel_in_km;
                });
            };

            // Process all activity types
            processActivities(lineman.power_interruptions);
            processActivities(lineman.kwh_meters);
            processActivities(lineman.line_services);
            processActivities(lineman.dles);
            processActivities(lineman.lmdgas);

            // Return formatted lineman data
            return {
                ...lineman,
                activities: activities.sort((a, b) => 
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                ),
                total_numerical_rating: get_numerical_rating({
                    standard_qty: totals.standard,
                    accomplishment_qty: totals.accomplishment,
                }),
                remarks: get_remarks({
                    numerical_rating: get_numerical_rating({
                        standard_qty: totals.standard,
                        accomplishment_qty: totals.accomplishment,
                    }),
                    remarks,
                }),
                total_distance_travelled: totals.distance,
            };
        });
    }

}
