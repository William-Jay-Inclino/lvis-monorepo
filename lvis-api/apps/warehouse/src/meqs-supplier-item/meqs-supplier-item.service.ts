import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeqsSupplierItemInput } from './dto/create-meqs-supplier-item.input';
import { UpdateMeqsSupplierItemInput } from './dto/update-meqs-supplier-item.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { MEQSSupplierItem, Prisma } from 'apps/warehouse/prisma/generated/client';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { isAdmin } from '../__common__/helpers';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class MeqsSupplierItemService {

	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: WarehouseAuditService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateMeqsSupplierItemInput): Promise<MEQSSupplierItem> {

		if (!this.canAccess(input.meqs_supplier_id)) {
			throw new ForbiddenException('Only Admin and Owner can create meqs supplier item!')
		}

		const data: Prisma.MEQSSupplierItemCreateInput = {
			meqs_supplier: { connect: { id: input.meqs_supplier_id } },
			canvass_item: { connect: { id: input.canvass_item_id } },
			price: input.price,
			notes: input.notes ?? null,
			is_awarded: input.is_awarded,
			vat_type: input.vat_type,
		}

		const created = await this.prisma.mEQSSupplierItem.create({
			data,
			include: {
				meqs_supplier: true,
				canvass_item: true
			}
		})

		return created

	}

	async findOne(id: string): Promise<MEQSSupplierItem | null> {
		const item = await this.prisma.mEQSSupplierItem.findUnique({
			include: {
				meqs_supplier: true,
				canvass_item: true
			},
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('MEQS Supplier Item not found')
		}

		return item
	}

	async update(id: string, input: UpdateMeqsSupplierItemInput): Promise<MEQSSupplierItem> {

		const existingItem = await this.findOne(id)

		if (!this.canAccess(input.meqs_supplier_id)) {
			throw new ForbiddenException('Only Admin and Owner can update meqs supplier item!')
		}

		const data: Prisma.MEQSSupplierItemUpdateInput = {
			price: input.price ?? existingItem.price,
			notes: input.notes ?? existingItem.notes,
			is_awarded: input.is_awarded ?? existingItem.is_awarded,
			vat_type: input.vat_type ?? existingItem.vat_type,
		}

		const updated = await this.prisma.mEQSSupplierItem.update({
			data,
			where: { id },
			include: {
				meqs_supplier: true,
				canvass_item: true
			}
		})

		return updated

	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

		if (!this.canAccess(existingItem.meqs_supplier_id)) {
			throw new ForbiddenException('Only Admin and Owner can remove meqs supplier item!')
		}

		await this.prisma.mEQSSupplierItem.delete({
			where: { id },
		})

		return {
			success: true,
			msg: "MEQS Supplier Item successfully deleted"
		}

	}

	async awardSupplier(
		id: string, 
		meqs_supplier_id: string, 
		canvass_item_id: string, 
		metadata: { ip_address: string, device_info: any }
	): Promise<WarehouseRemoveResponse> {

		if (!this.canAccess(meqs_supplier_id)) {
			throw new ForbiddenException('Only Admin and Owner can award meqs supplier item!')
		}

		const meqsSupplier = await this.prisma.mEQSSupplier.findUnique({
			where: {
				id: meqs_supplier_id
			},
			select: {
				meqs: {
					include: {
						meqs_suppliers: {
							include: {
								meqs_supplier_items: true
							}
						}
					}
				}
			}
		})

		if (!meqsSupplier) {
			throw new NotFoundException("MEQS Supplier not found with ID of " + meqs_supplier_id)
		}

		const meqsSupplierItem = await this.prisma.mEQSSupplierItem.findUnique({
			where: { id }
		})

		if (!meqsSupplierItem) {
			throw new NotFoundException("MEQS Supplier Item not found with ID of " + id)
		}

		return await this.prisma.$transaction(async(tx) => {

			const suppliers = meqsSupplier.meqs.meqs_suppliers
	
			for (let supplier of suppliers) {
	
				const item = supplier.meqs_supplier_items.find(i => i.canvass_item_id === canvass_item_id)
	
				if (item) {
	
					await tx.mEQSSupplierItem.update({
						where: {
							id: item.id
						},
						data: {
							is_awarded: false,
						}
					})
	
				}
	
			}
	
			const updated = await tx.mEQSSupplierItem.update({
				where: { id },
				data: {
					is_awarded: true,
				}
			})

			// create audit
			await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.MEQS_SUPPLIER_ITEM,
				action: 'AWARD-MEQS-SUPPLIER-ITEM',
				reference_id: updated.id,
				metadata: updated,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)
	
			return {
				success: true,
				msg: 'Supplier awarded successfully!'
			}

		})


	}

	async attachNote(
		meqs_id: string, 
		canvass_item_id: string, 
		notes: string, 
		metadata: { ip_address: string, device_info: any }
	): Promise<WarehouseRemoveResponse> {


		const meqs = await this.prisma.mEQS.findUnique({
			where: {
				id: meqs_id
			},
			select: {
				created_by: true,
				meqs_suppliers: {
					include: {
						meqs_supplier_items: true
					}
				}
			}
		})

		if (!meqs) {
			throw new NotFoundException("MEQS not found with ID of " + meqs_id)
		}

        const hasPermission = meqs.created_by === this.authUser.user.username || isAdmin(this.authUser);

        if (!hasPermission) {
            throw new ForbiddenException('Only Admin and Owner can attach note!')
        }

		return await this.prisma.$transaction(async(tx) => {

			const suppliers = meqs.meqs_suppliers

			const items_noted: MEQSSupplierItem[] = []

			for (let supplier of suppliers) {
	
				const item = supplier.meqs_supplier_items.find(i => i.canvass_item_id === canvass_item_id)
	
				if (item) {
	
					const meqs_supplier_item = await tx.mEQSSupplierItem.update({
						where: {
							id: item.id
						},
						data: {
							notes,
						}
					})

					items_noted.push(meqs_supplier_item)
	
				}
	
			}

			for(let item of items_noted) {

				// create audit
				await this.audit.createAuditEntry({
					username: this.authUser.user.username,
					table: DB_TABLE.MEQS_SUPPLIER_ITEM,
					action: 'ATTACH-REMARKS-MEQS-SUPPLIER-ITEM',
					reference_id: item.id,
					metadata: item,
					ip_address: metadata.ip_address,
					device_info: metadata.device_info
				}, tx as Prisma.TransactionClient)

			}

	
			return {
				success: true,
				msg: 'Successfully attached note!'
			}

		})


	}

	private async canAccess(meqs_supplier_id: string): Promise<boolean> {

		if (isAdmin(this.authUser)) return true

		const meqsSupplier = await this.prisma.mEQSSupplier.findUnique({
			where: {
				id: meqs_supplier_id
			},
			include: {
				meqs: true
			}
		})

		if (!meqsSupplier) {
			throw new NotFoundException('meqsSupplier not found with id of ' + meqs_supplier_id)
		}

		const isOwner = meqsSupplier.meqs.created_by === this.authUser.user.username

		if (isOwner) return true

		return false

	}

}
