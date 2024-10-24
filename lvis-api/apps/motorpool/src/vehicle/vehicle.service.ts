import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Vehicle } from 'apps/motorpool/prisma/generated/client';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { MotorpoolRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

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
			rf_id: input.rf_id,
			classification_id: input.classification_id,
			assignee_id: input.assignee_id,
			name: input.name,
			date_acquired: new Date(input.date_acquired),
			status: input.status,
			created_by: this.authUser.user.username
		}

		const created = await this.prisma.vehicle.create({
			data
		})

		this.logger.log('Successfully created Vehicle')

		return created

	}

	async findAll(): Promise<Vehicle[]> {
		return await this.prisma.vehicle.findMany()
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

	async update(id: string, input: UpdateVehicleInput): Promise<Vehicle> {

		const existingItem = await this.findOne(id)

		const data: Prisma.VehicleUpdateInput = {
			vehicle_number: input.vehicle_number ?? existingItem.vehicle_number,
			plate_number: input.plate_number ?? existingItem.plate_number,
			rf_id: input.rf_id ?? existingItem.rf_id,
			classification_id: input.classification_id ?? existingItem.classification_id,
			assignee_id: input.assignee_id ?? existingItem.assignee_id,
			name: input.name ?? existingItem.name,
			date_acquired: input.date_acquired ? new Date(input.date_acquired) : existingItem.date_acquired,
			status: input.status ?? existingItem.status,
			updated_by: this.authUser.user.username
		}


		const updated = await this.prisma.vehicle.update({
			data,
			where: {
				id
			}
		})

		this.logger.log('Successfully updated Vehicle')

		return updated

	}

	async remove(id: string): Promise<MotorpoolRemoveResponse> {

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
