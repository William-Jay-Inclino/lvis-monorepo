import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFuelTypeInput } from './dto/create-fuel-type.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, FuelType } from 'apps/warehouse/prisma/generated/client';
import { UpdateFuelTypeInput } from './dto/update-fuel-type.input';
import { WarehouseRemoveResponse } from '../__common__/classes';

@Injectable()
export class FuelTypeService {

	constructor(private readonly prisma: PrismaService) { }

	async create(input: CreateFuelTypeInput): Promise<FuelType> {

		const data: Prisma.FuelTypeCreateInput = {
			name: input.name,
		}

		const created = await this.prisma.fuelType.create({
			data
		})

		return created

	}

	async findAll(): Promise<FuelType[]> {
		return await this.prisma.fuelType.findMany()
	}

	async findOne(id: number): Promise<FuelType | null> {

		const item = await this.prisma.fuelType.findUnique({
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Fuel Type not found')
		}

		return item
	}

	async update(id: number, input: UpdateFuelTypeInput): Promise<FuelType> {

		const existingItem = await this.findOne(id)

		const data: Prisma.FuelTypeUpdateInput = {
			name: input.name ?? existingItem.name,
		}


		const updated = await this.prisma.fuelType.update({
			data,
			where: {
				id
			}
		})

		return updated

	}

	async remove(id: number): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.fuelType.delete({
			where: { id }
		})

		return {
			success: true,
			msg: "Fuel Type successfully deleted"
		}

	}

}
