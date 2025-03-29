import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStationInput } from './dto/create-station.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Station } from 'apps/warehouse/prisma/generated/client';
import { UpdateStationInput } from './dto/update-station.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { SETTINGS } from '../__common__/constants';

@Injectable()
export class StationService {

	constructor(private readonly prisma: PrismaService) { }

	async create(input: CreateStationInput): Promise<Station> {

		const data: Prisma.StationCreateInput = {
			name: input.name,
		}

		const created = await this.prisma.station.create({
			data
		})

		return created

	}

	async findAll(): Promise<Station[]> {
		return await this.prisma.station.findMany()
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

	async findByIds(ids: string[]): Promise<Station[]> {

		return await this.prisma.station.findMany({
			where: {
				id: { in: ids },
			}
		})

	}

	async update(id: string, input: UpdateStationInput): Promise<Station> {

		const existingItem = await this.findOne(id)

		const data: Prisma.StationUpdateInput = {
			name: input.name ?? existingItem.name,
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

		await this.prisma.station.delete({
			where: { id }
		})

		return {
			success: true,
			msg: "Station successfully deleted"
		}

	}

	async get_default_station(): Promise<Station> {

		const default_station = await this.prisma.setting.findUnique({
			where: {
				key: SETTINGS.DEFAULT_STATION
			}
		})

		if(!default_station) {
			throw new NotFoundException('No default station set')
		}

		const station = await this.prisma.station.findUnique({
			where: { id: default_station.value }
		})

		if(!station) {
			throw new NotFoundException('Station not found with id of ' + default_station.value)
		}

		return station

	}

}
