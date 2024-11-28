import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCanvassItemInput } from './dto/create-canvass-item.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { CanvassItem, Prisma } from 'apps/warehouse/prisma/generated/client';
import { UpdateCanvassItemInput } from './dto/update-canvass-item.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { isAdmin } from '../__common__/helpers';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class CanvassItemService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateCanvassItemInput): Promise<CanvassItem> {

		if (!this.canAccess(input.canvass_id)) {
			throw new ForbiddenException('Only Admin and Owner can create canvass item!')
		}

		const data: Prisma.CanvassItemCreateInput = {
			canvass: { connect: { id: input.canvass_id } },
			unit: input.unit_id ? { connect: { id: input.unit_id } } : undefined,
			item: input.item_id ? { connect: { id: input.item_id } } : undefined,
			description: input.description,
			quantity: input.quantity,
		}

		// const meqsSuppliers = await this.prisma.mEQSSupplier.findMany({
		// 	where: {
		// 		meqs: {
		// 			OR: [
		// 				{ rv: { canvass_id: input.canvass_id } },
		// 				{ spr: { canvass_id: input.canvass_id } },
		// 				{ jo: { canvass_id: input.canvass_id } }
		// 			]
		// 		}
		// 	}
		// })

		// if canvass is still not reference in MEQS then normal create
		// if (meqsSuppliers.length === 0) {

		// 	const createdCanvassItem = await this.prisma.canvassItem.create({
		// 		data,
		// 		include: {
		// 			unit: true,
		// 			item: true
		// 		}
		// 	})

		// 	return createdCanvassItem

		// }


		// if canvass is already reference in MEQS then also create meqs_supplier_item in all meqs_supplier

		// const meqsSupplierItems = []

		// for (let meqsSupplier of meqsSuppliers) {

		// 	meqsSupplierItems.push({
		// 		meqs_supplier_id: meqsSupplier.id,
		// 		price: 0,
		// 		notes: '',
		// 		is_awarded: false,
		// 		vat_type: VAT_TYPE.NONE,
		// 	})

		// }

		// data.meqs_supplier_items = {
		// 	create: meqsSupplierItems.map((i: MeqsSupplierItem) => {

		// 		const meqsSupplierItemData: Prisma.MEQSSupplierItemCreateWithoutCanvass_itemInput = {
		// 			meqs_supplier: { connect: { id: i.meqs_supplier_id } },
		// 			price: i.price,
		// 			notes: i.notes,
		// 			is_awarded: false,
		// 			vat_type: VAT_TYPE.NONE,
		// 		}

		// 		return meqsSupplierItemData

		// 	})
		// }

		const created = await this.prisma.canvassItem.create({
			data,
			include: {
				unit: true,
			}
		})

		return created


	}

	async findOne(id: string): Promise<CanvassItem | null> {
		const item = await this.prisma.canvassItem.findUnique({
			include: {
				unit: true,
				item: true
			},
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Item not found')
		}

		return item
	}

	async update(id: string, input: UpdateCanvassItemInput): Promise<CanvassItem> {

		const existingItem = await this.findOne(id)

		if (!this.canAccess(existingItem.canvass_id)) {
			throw new ForbiddenException('Only Admin and Owner can update canvass item!')
		}

		const data: Prisma.CanvassItemUpdateInput = {
			description: input.description ?? existingItem.description,
			unit: input.unit_id ? { connect: { id: input.unit_id } } : { disconnect: true },
			item: input.item_id ? { connect: { id: input.item_id } } : { disconnect: true },
			quantity: input.quantity,
		}

		const updated = await this.prisma.canvassItem.update({
			data,
			where: {
				id
			},
			include: {
				unit: true,
				item: true
			}
		})

		return updated
	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

		if (!this.canAccess(existingItem.canvass_id)) {
			throw new ForbiddenException('Only Admin and Owner can remove canvass item!')
		}

		await this.prisma.canvassItem.delete({
			where: { id }
		})

		return {
			success: true,
			msg: "Canvass Item successfully deleted"
		}

	}

	private async canAccess(canvass_id: string): Promise<boolean> {

		if (isAdmin(this.authUser)) return true

		const canvass = await this.prisma.canvass.findUnique({
			where: { id: canvass_id }
		})

		if (!canvass) {
			throw new NotFoundException('Canvass not found with id of ' + canvass_id)
		}

		const isOwner = canvass.created_by === this.authUser.user.username

		if (isOwner) return true

		return false

	}

}
