import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemTypeInput } from './dto/create-item-type.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, ItemType } from 'apps/warehouse/prisma/generated/client';
import { UpdateItemTypeInput } from './dto/update-item-type.input';
import { WarehouseRemoveResponse } from '../__common__/classes';

@Injectable()
export class ItemTypeService {

	constructor(private readonly prisma: PrismaService) { }

	async create(input: CreateItemTypeInput): Promise<ItemType> {

		const data: Prisma.ItemTypeCreateInput = {
			code: input.code,
			name: input.name,
		}

		const created = await this.prisma.itemType.create({
			data
		})

		return created

	}

	async findAll(): Promise<ItemType[]> {
		return await this.prisma.itemType.findMany()
	}

	async findOne(id: number): Promise<ItemType | null> {

		const item = await this.prisma.itemType.findUnique({
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Item Type not found')
		}

		return item
	}

	async update(id: number, input: UpdateItemTypeInput): Promise<ItemType> {

		const existingItem = await this.findOne(id)

		const data: Prisma.ItemTypeUpdateInput = {
			code: input.code ?? existingItem.code,
			name: input.name ?? existingItem.name,
		}


		const updated = await this.prisma.itemType.update({
			data,
			where: {
				id
			}
		})

		return updated

	}

	async remove(id: number): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.itemType.delete({
			where: { id }
		})

		return {
			success: true,
			msg: "Item Type successfully deleted"
		}

	}

}
