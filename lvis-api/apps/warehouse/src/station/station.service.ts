import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStationInput } from './dto/create-station.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Station } from 'apps/warehouse/prisma/generated/client';
import { UpdateStationInput } from './dto/update-station.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';

@Injectable()
export class StationService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateStationInput): Promise<Station> {

		const data: Prisma.StationCreateInput = {
			name: input.name,
			location: input.location,
			created_by: this.authUser.user.username
		}

		const created = await this.prisma.station.create({
			data
		})

		return created

	}

	async findAll(): Promise<Station[]> {
		return await this.prisma.station.findMany({
			where: {
				deleted_at: null
			}
		})
	}

	async findOne(id: string): Promise<Station | null> {

		const item = await this.prisma.station.findUnique({
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Station not found')
		}

		return item
	}

	async update(id: string, input: UpdateStationInput): Promise<Station> {

		const existingItem = await this.findOne(id)

		const data: Prisma.StationUpdateInput = {
			name: input.name ?? existingItem.name,
			location: input.location ?? existingItem.location,
			updated_by: this.authUser.user.username
		}


		const updated = await this.prisma.station.update({
			data,
			where: {
				id
			}
		})

		return updated

	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.station.update({
			where: { id },
			data: {
				deleted_at: new Date(),
				deleted_by: this.authUser.user.username
			}
		})

		return {
			success: true,
			msg: "Station successfully deleted"
		}

	}

}
