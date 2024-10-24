import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGasStationInput } from './dto/create-gas-station.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, GasStation } from 'apps/motorpool/prisma/generated/client';
import { UpdateGasStationInput } from './dto/update-gas-station.input';
import { MotorpoolRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class GasStationService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateGasStationInput): Promise<GasStation> {

		const data: Prisma.GasStationCreateInput = {
			name: input.name,
      location: input.location,
      contact_number: input.contact_number,
		}

		const created = await this.prisma.gasStation.create({
			data
		})

		return created

	}

	async findAll(): Promise<GasStation[]> {
		return await this.prisma.gasStation.findMany()
	}

	async findOne(id: number): Promise<GasStation | null> {

		const item = await this.prisma.gasStation.findUnique({
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Gas Station not found')
		}

		return item
	}

	async update(id: number, input: UpdateGasStationInput): Promise<GasStation> {

		const existingItem = await this.findOne(id)

		const data: Prisma.GasStationUpdateInput = {
			name: input.name ?? existingItem.name,
			location: input.location ?? existingItem.location,
			contact_number: input.contact_number ?? existingItem.contact_number,
		}


		const updated = await this.prisma.gasStation.update({
			data,
			where: {
				id
			}
		})

		return updated

	}

	async remove(id: number): Promise<MotorpoolRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.gasStation.delete({
			where: { id }
		})

		return {
			success: true,
			msg: "Gas Station successfully deleted"
		}

	}

}
