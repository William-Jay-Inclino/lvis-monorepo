import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Vehicle } from 'apps/warehouse/prisma/generated/client';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { VEHICLE_STATUS } from './entities/vehicle.enums';
import { UpdateVehicleResponse } from './entities/update-vehicle-response.entity';
import { VehiclesResponse } from './entities/vehicles-response.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class VehicleService {

	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: WarehouseAuditService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(
		input: CreateVehicleInput, 
		metadata: { ip_address: string, device_info: any }
	): Promise<Vehicle> {

		// Check if the vehicle number already exists
		const existingVehicle = await this.prisma.vehicle.findUnique({
			where: { vehicle_number: input.vehicle_number },
		});

		if (existingVehicle) {
			throw new Error('Vehicle number must be unique');
		}

		// Check if the plate number already exists
		const existingVehicle2 = await this.prisma.vehicle.findUnique({
			where: { plate_number: input.plate_number },
		});

		if (existingVehicle2) {
			throw new Error('Plate number must be unique');
		}

		const data: Prisma.VehicleCreateInput = {
			vehicle_number: input.vehicle_number,
			plate_number: input.plate_number,
			rf_id: input.rf_id ?? null,
			classification_id: input.classification_id,
			assignee_id: input.assignee_id,
			name: input.name,
			date_acquired: new Date(input.date_acquired),
			status: VEHICLE_STATUS.AVAILABLE_FOR_TRIP,
			created_by: this.authUser.user.username
		}

		return await this.prisma.$transaction(async(tx) => {

			const created = await this.prisma.vehicle.create({
				data
			})
			
			// create audit
			await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.VEHICLE,
				action: 'CREATE-PROJECT',
				reference_id: created.id,
				metadata: created,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)

			return created
		})


	}

	async findAll(
		page: number, 
		pageSize: number, 
		assignee_id?: string,
	): Promise<VehiclesResponse> {
	
		const skip = (page - 1) * pageSize;
	
		let whereCondition: any = {
			deleted_at: null,
		};
	
		if (assignee_id) {
			whereCondition.assignee_id = {
				equals: assignee_id,
			};
		}
	
		const [items, totalItems] = await this.prisma.$transaction([
			this.prisma.vehicle.findMany({
				where: whereCondition,
				orderBy: {
					vehicle_number: 'asc',
				},
				skip,
				take: pageSize,
			}),
			this.prisma.vehicle.count({
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
	
	async findOne(id: string): Promise<Vehicle | null> {

		const item = await this.prisma.vehicle.findUnique({
			where: { id },
			include: {
				gas_slips: {
					include: {
						gas_station: true,
						fuel_type: true,
					}
				},
				trip_tickets: true,
				service_history: {
					include: {
						service_center: true
					}
				}
			}
		})

		if (!item) {
			throw new NotFoundException('Vehicle not found')
		}

		return item
	}

	async update(
		id: string, 
		input: UpdateVehicleInput, 
		metadata: { ip_address: string, device_info: any }
	): Promise<UpdateVehicleResponse> {

		const existingItem = await this.prisma.vehicle.findUnique({
			where: { id }
		})

		if(!existingItem) {
			throw new NotFoundException("Vehicle not found with id " + id)
		}
	
		// Check for vehicle_number uniqueness
		if (input.vehicle_number && input.vehicle_number !== existingItem.vehicle_number) {
			const vehicleNumberExists = await this.prisma.vehicle.findUnique({
				where: { vehicle_number: input.vehicle_number },
			});
			if (vehicleNumberExists) {
				return {
					success: false,
					msg: "Vehicle number already exists",
				};
			}
		}
	
		// Check for plate_number uniqueness
		if (input.plate_number && input.plate_number !== existingItem.plate_number) {
			const plateNumberExists = await this.prisma.vehicle.findUnique({
				where: { plate_number: input.plate_number },
			});
			if (plateNumberExists) {
				return {
					success: false,
					msg: "Plate number already exists",
				};
			}
		}
	
		// Check for rf_id uniqueness
		if (input.rf_id && input.rf_id !== existingItem.rf_id) {
			const rfIdExists = await this.prisma.vehicle.findUnique({
				where: { rf_id: input.rf_id },
			});
			if (rfIdExists) {
				return {
					success: false,
					msg: "RFID already exists",
				};
			}
		}
	
		const data: Prisma.VehicleUpdateInput = {
			vehicle_number: input.vehicle_number ?? existingItem.vehicle_number,
			plate_number: input.plate_number ?? existingItem.plate_number,
			rf_id: input.rf_id ?? existingItem.rf_id,
			classification_id: input.classification_id ?? existingItem.classification_id,
			assignee_id: input.assignee_id ?? existingItem.assignee_id,
			name: input.name ?? existingItem.name,
			date_acquired: input.date_acquired ? new Date(input.date_acquired) : existingItem.date_acquired,
			updated_by: this.authUser.user.username
		};
		
		return await this.prisma.$transaction(async(tx) => {

			const updated = await this.prisma.vehicle.update({
				data,
				where: { id },
			});
			
			// create audit
			await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.VEHICLE,
				action: 'UPDATE-VEHICLE',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as Prisma.TransactionClient)

			return {
				success: true,
				msg: "Successfully updated Vehicle",
				data: updated,
			};

		})

	}

	async remove(
		id: string, 
		metadata: { ip_address: string, device_info: any }
	): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.prisma.vehicle.findUnique({
			where: { id }
		})

		if(!existingItem) {
			throw new NotFoundException("Vehicle not found with id " + id)
		}

		return await this.prisma.$transaction(async(tx) => {

			const updatedItem = await this.prisma.vehicle.update({
				where: { id },
				data: { deleted_at: new Date() }
			})

			await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.VEHICLE,
				action: 'SOFT-DELETE-VEHICLE',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updatedItem
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as Prisma.TransactionClient)
	
			return {
				success: true,
				msg: "Vehicle successfully deleted"
			}

		})


	}

	async findVehiclesByName(q: string) {
		const input = q.trim();
	
		const items = await this.prisma.vehicle.findMany({
			where: {
				deleted_at: null,
				OR: [
					{ name: { startsWith: input, mode: 'insensitive' } },
					{ vehicle_number: { startsWith: input, mode: 'insensitive' } },
				],
			},
			take: 10,
		});
	
		return items;
	}

	async findByVehicleNumber(vehicle_number: string): Promise<Vehicle> {

        const item = await this.prisma.vehicle.findUnique({
            where: { vehicle_number }
        })

        if (!item) {
            throw new NotFoundException('Vehicle not found')
        }

        return item

    }

}
