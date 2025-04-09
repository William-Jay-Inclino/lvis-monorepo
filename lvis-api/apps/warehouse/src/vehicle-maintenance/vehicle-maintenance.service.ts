import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { AuthUser } from "apps/system/src/__common__/auth-user.entity";
import { PrismaService } from "../__prisma__/prisma.service";
import { CreateVehicleMaintenanceInput } from "../vehicle-maintenance/dto/create-vehicle-maintenance.input";
import { Prisma, VehicleMaintenance } from "apps/warehouse/prisma/generated/client";
import { VehicleMaintenanceResponse } from "./entities/vehicles-response.entity";
import { getDateRange } from "../__common__/helpers";
import { UpdateVehicleMaintenanceInput } from "./dto/update-vehicle-maintenance.input";
import { WarehouseRemoveResponse } from "../__common__/classes";
import { endOfYear, startOfYear } from "date-fns";
import { UpdateCompletionResponse } from "./entities/update-completion-response";
import { WarehouseAuditService } from "../warehouse_audit/warehouse_audit.service";
import { DB_TABLE } from "../__common__/types";

@Injectable()
export class VehicleMaintenanceService {

    private readonly logger = new Logger(VehicleMaintenanceService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: WarehouseAuditService,
    ) {}

    async create(
        input: CreateVehicleMaintenanceInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<VehicleMaintenance> {

        try {
            const authUser = metadata.authUser
            
            const refNumber = await this.getLatestRefNumber()
    
            const data: Prisma.VehicleMaintenanceCreateInput = {
                ref_number: refNumber,
                vehicle: {
                    connect: { id: input.vehicle_id }
                },
                service_center: {
                    connect: {
                        id: input.service_center_id
                    }
                },
                service_date: new Date(input.service_date),
                service_mileage: input.service_mileage,
                next_service_date: new Date(input.next_service_date),
                next_service_mileage: input.next_service_mileage,
                cost: input.cost,
                remarks: input.remarks,
                performed_by: input.performed_by,
                created_by: authUser.user.username,
                services: {
                    create: input.services.map(i => {
                        return {
                            service_id: i.service_id,
                            note: i.note,
                        }
                    })
                }
            }
            
            return await this.prisma.$transaction(async(tx) => {

                const created = await tx.vehicleMaintenance.create({
                    data,
                    include: {
                        vehicle: true,
                        service_center: true,
                        services: true,
                    }
                })

                // create audit
                await this.audit.createAuditEntry({
                    username: authUser.user.username,
                    table: DB_TABLE.VEHICLE_MAINTENANCE,
                    action: 'CREATE-VEHICLE-MAINTENANCE',
                    reference_id: created.id,
                    metadata: created,
                    ip_address: metadata.ip_address,
                    device_info: metadata.device_info
                }, tx as unknown as Prisma.TransactionClient)
        
                return created

            })


        } catch (error) {
            this.logger.error('Error in creating vehicle maintenance', error)
        }

	}

    async findAll(
		page: number, 
		pageSize: number, 
		vehicle_id?: string,
		service_center_id?: string,
		service_date?: string,
        is_completed?: boolean,
	): Promise<VehicleMaintenanceResponse> {
	
		const skip = (page - 1) * pageSize;
	
		let whereCondition: any = {
			deleted_at: null,
		};
	
		if (vehicle_id) {
			whereCondition.vehicle_id = {
				equals: vehicle_id,
			};
		}

        if (service_center_id) {
			whereCondition.service_center_id = {
				equals: service_center_id,
			};
		}

        if (is_completed !== undefined) {
            whereCondition.is_completed = {
                equals: is_completed,
            };
        }

        if (service_date) {
            const { startDate, endDate } = getDateRange(service_date);

            whereCondition.service_date = {
                gte: startDate,
                lte: endDate,
            };

        }

        if(!vehicle_id && !service_center_id && is_completed === undefined && !service_date) {
            const startOfYearDate = startOfYear(new Date());
            const endOfYearDate = endOfYear(new Date());

            whereCondition.created_at = {
                gte: startOfYearDate,
                lte: endOfYearDate,
            };
        }
	
		const [items, totalItems] = await this.prisma.$transaction([
			this.prisma.vehicleMaintenance.findMany({
				where: whereCondition,
                include: {
                    vehicle: true,
                    service_center: true,
                },
				orderBy: {
					ref_number: 'asc',
				},
				skip,
				take: pageSize,
			}),
			this.prisma.vehicleMaintenance.count({
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

    async findBy(payload: { id?: string; ref_number?: string }): Promise<VehicleMaintenance | null> {
        if (!payload.id && !payload.ref_number) {
            throw new BadRequestException('Either id or ref_number must be provided');
        }
    
        const where: Prisma.VehicleMaintenanceWhereUniqueInput = payload.id
            ? { id: payload.id }
            : { ref_number: payload.ref_number };
    
        const item = await this.prisma.vehicleMaintenance.findUnique({
            where,
            include: {
                vehicle: true,
                service_center: true,
                services: {
                    include: {
                        service: true
                    }
                }
            },
        });
    
        if (!item) {
            throw new NotFoundException('Vehicle Maintenance not found');
        }
    
        return item;
    }

    async findRefNumbersByInput(input: string, includeDetails: boolean = false) {

		const trimmedInput = input.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                ref_number: true, 
                vehicle: true,
                service_center:true,
            }; 
        } else {
            selectClause = { ref_number: true };
        }

        const items = await this.prisma.vehicleMaintenance.findMany({
            select: selectClause,
            where: {
                ref_number: {
                    startsWith: trimmedInput
                },
                deleted_at: null
            },
            orderBy: {
                ref_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

    async update(
        id: string, 
        input: UpdateVehicleMaintenanceInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<VehicleMaintenance> {

        const authUser = metadata.authUser

		const existingItem = await this.prisma.vehicleMaintenance.findUnique({
            where: { id },
            include: {
                vehicle: true,
                service_center: true,
                services: true,
            }
        })

        if(!existingItem) {
            throw new NotFoundException('Vehicle Maintenance not found')
        }

        return this.prisma.$transaction(async(tx) => {

            // delete all vehicle maintenance detail -> services
            await tx.vehicleMaintenanceDetail.deleteMany({
                where: {
                    maintenance_id: id
                }
            })

            const data: Prisma.VehicleMaintenanceUpdateInput = {
                vehicle: {
                    connect: { id: input.vehicle_id ?? existingItem.vehicle_id },
                },
                service_center: {
                    connect: { id: input.service_center_id ?? existingItem.service_center_id },
                },
                service_date: input.service_date ? new Date(input.service_date) : existingItem.service_date,
                service_mileage: input.service_mileage ?? existingItem.service_mileage,
                next_service_date: input.next_service_date ? new Date(input.next_service_date) : existingItem.next_service_date,
                next_service_mileage: input.next_service_mileage ?? existingItem.next_service_mileage,
                cost: input.cost ?? existingItem.cost,
                remarks: input.remarks ?? existingItem.remarks,
                performed_by: input.performed_by ?? existingItem.performed_by,
                services: input.services?.length
                ? {
                      create: input.services.map((service) => ({
                          service_id: service.service_id,
                          note: service.note,
                      })),
                  }
                : undefined,
            };
            
            const updated = await tx.vehicleMaintenance.update({
                data,
                where: { id },
                include: {
                    vehicle: true,
                    service_center: true,
                    services: true,
                }
            });

            await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.VEHICLE_MAINTENANCE,
				action: 'UPDATE-VEHICLE-MAINTENANCE',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)

            return updated
        
        })
	
	}

    async remove(
        id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<WarehouseRemoveResponse> {
        const authUser = metadata.authUser

		const existingItem = await this.prisma.vehicleMaintenance.findUnique({ where: { id } })

        if(!existingItem) {
            throw new NotFoundException('Vehicle Maintenance not found')
        }

        return this.prisma.$transaction(async(tx) => {

            const updated = await tx.vehicleMaintenance.update({
                where: { id },
                data: { deleted_at: new Date() }
            })

			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.VEHICLE_MAINTENANCE,
				action: 'SOFT-DELETE-VEHICLE-MAINTENANCE',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: "Vehicle Maintenance successfully deleted"
            }

        })


	}

    async update_field_is_completed(
        id: string, 
        is_completed: boolean, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<UpdateCompletionResponse> {

        try {

            return this.prisma.$transaction(async(tx) => {
                const authUser = metadata.authUser

                const existingItem = await tx.vehicleMaintenance.findUnique({ where: { id } })

                if(!existingItem) {
                    throw new NotFoundException('Vehicle Maintenance not found')
                }

                const x = await tx.vehicleMaintenance.update({
                    select: {
                        is_completed: true,
                    },
                    where: { id },
                    data: { is_completed }
                })

                await this.audit.createAuditEntry({
                    username: authUser.user.username,
                    table: DB_TABLE.VEHICLE_MAINTENANCE,
                    action: 'UPDATE-VEHICLE-MAINTENANCE',
                    reference_id: id,
                    metadata: {
                        'old_value:field=is_completed': existingItem.is_completed,
                        'new_value:field=is_completed': is_completed
                    },
                    ip_address: metadata.ip_address,
                    device_info: metadata.device_info
                }, tx as unknown as Prisma.TransactionClient)
        
                return {
                    success: true,
                    msg: "Successfully updated status",
                    is_completed: x.is_completed
                }

            })

            
        } catch (error) {
            throw error
        }

    }

    async get_maintenance_schedule(d: {start: Date, end: Date}) {
      
        const maintenanceRecords = await this.prisma.vehicleMaintenance.findMany({
            where: {
                next_service_date: {
                    gte: d.start,
                    lte: d.end,
                },
            },
            include: {
                vehicle: true
            },
            orderBy: {
                next_service_date: 'asc'
            }
        });

        return maintenanceRecords;
    }
    
    private async getLatestRefNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.vehicleMaintenance.findFirst({
            where: { ref_number: { startsWith: currentYear } },
            orderBy: { ref_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.ref_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

}