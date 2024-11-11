import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Vehicle } from 'apps/warehouse/prisma/generated/client';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { VEHICLE_STATUS } from './entities/vehicle.enums';
import { UpdateVehicleResponse } from './entities/update-vehicle-response.entity';

@Injectable()
export class VehicleService {

	private readonly logger = new Logger(VehicleService.name);
	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateVehicleInput): Promise<Vehicle> {

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

		const created = await this.prisma.vehicle.create({
			data
		})

		this.logger.log('Successfully created Vehicle')

		return created

	}

	async findAll(): Promise<Vehicle[]> {
		return await this.prisma.vehicle.findMany({
			orderBy: {
				vehicle_number: 'asc'
			}
		})
	}

	async findOne(id: string): Promise<Vehicle | null> {

		const item = await this.prisma.vehicle.findUnique({
			where: { id }
		})

		console.log('item', item, id)

		if (!item) {
			throw new NotFoundException('Vehicle not found')
		}

		return item
	}

	async update(id: string, input: UpdateVehicleInput): Promise<UpdateVehicleResponse> {

		const existingItem = await this.findOne(id);
	
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
	
		const updated = await this.prisma.vehicle.update({
			data,
			where: { id },
		});
	
		this.logger.log('Successfully updated Vehicle');
	
		return {
			success: true,
			msg: "Successfully updated Vehicle",
			data: updated,
		};
	}
	

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.vehicle.delete({
			where: { id },
		})

		return {
			success: true,
			msg: "Vehicle successfully deleted"
		}

	}

}
