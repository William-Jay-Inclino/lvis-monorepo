import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleServiceInput } from './dto/create-vehicle-service.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { VehicleService, Prisma } from 'apps/warehouse/prisma/generated/client';
import { UpdateVehicleServiceInput } from './dto/update-vehicle-service.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class VehicleServiceService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateVehicleServiceInput): Promise<VehicleService> {

		const data: Prisma.VehicleServiceCreateInput = {
			name: input.name,
		}

		const created = await this.prisma.vehicleService.create({ data })

		return created
	}

    async findAll(): Promise<VehicleService[]> {
        return await this.prisma.vehicleService.findMany()
    }

	async findOne(id: string): Promise<VehicleService | null> {
		const item = await this.prisma.vehicleService.findUnique({
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Vehicle Service not found')
		}

		return item
	}

	async update(id: string, input: UpdateVehicleServiceInput): Promise<VehicleService> {

		const existingItem = await this.findOne(id)

		const data: Prisma.VehicleServiceUpdateInput = {
			name: input.name ?? existingItem.name,
		}

		const updated = await this.prisma.vehicleService.update({
			data,
			where: {
				id
			}
		})

		return updated
	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.vehicleService.delete({
			where: { id }
		})

		return {
			success: true,
			msg: "Vehicle Service successfully deleted"
		}

	}

}
