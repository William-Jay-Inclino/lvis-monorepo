import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFuelTypeInput } from './dto/create-fuel-type.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, FuelType } from 'apps/motorpool/prisma/generated/client';
import { UpdateFuelTypeInput } from './dto/update-fuel-type.input';
import { MotorpoolRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class FuelTypeService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

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

		const fuel = await this.prisma.fuelType.findUnique({
			where: { id }
		})

		if (!fuel) {
			throw new NotFoundException('Fuel Type not found')
		}

		return fuel
	}

	async update(id: number, input: UpdateFuelTypeInput): Promise<FuelType> {

		const existingFuel = await this.findOne(id)

		const data: Prisma.FuelTypeUpdateInput = {
			name: input.name ?? existingFuel.name,
		}


		const updated = await this.prisma.fuelType.update({
			data,
			where: {
				id
			}
		})

		return updated

	}

	async remove(id: number): Promise<MotorpoolRemoveResponse> {

		const existingFuel = await this.findOne(id)

		await this.prisma.fuelType.delete({
			where: { id }
		})

		return {
			success: true,
			msg: "Fuel Type successfully deleted"
		}

	}

}
