import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCanvassItemInput } from './dto/create-canvass-item.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { CanvassItem, Prisma } from 'apps/warehouse/prisma/generated/client';
import { UpdateCanvassItemInput } from './dto/update-canvass-item.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { isAdmin } from '../__common__/helpers';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class CanvassItemService {

	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: WarehouseAuditService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(
		input: CreateCanvassItemInput, 
		metadata: { ip_address: string, device_info: any }
	): Promise<CanvassItem> {

		return await this.prisma.$transaction(async(tx) => {

			if (!this.canAccess(input.canvass_id, tx as Prisma.TransactionClient)) {
				throw new ForbiddenException('Only Admin and Owner can create canvass item!')
			}
	
			const data: Prisma.CanvassItemCreateInput = {
				canvass: { connect: { id: input.canvass_id } },
				unit: input.unit_id ? { connect: { id: input.unit_id } } : undefined,
				item: input.item_id ? { connect: { id: input.item_id } } : undefined,
				description: input.description,
				quantity: input.quantity,
			}
	
			const created = await tx.canvassItem.create({
				data,
				include: {
					unit: true,
				}
			})

            // create audit
            await this.audit.createAuditEntry({
                username: this.authUser.user.username,
                table: DB_TABLE.CANVASS_ITEM,
                action: 'CREATE-CANVASS-ITEM',
                reference_id: created.id,
                metadata: created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)
	
			return created

		})
	}

	async findOne(id: string, tx?: Prisma.TransactionClient): Promise<CanvassItem | null> {
		
        const prismaClient = tx || this.prisma;
		
		const item = await prismaClient.canvassItem.findUnique({
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

	async update(
		id: string, 
		input: UpdateCanvassItemInput, 
		metadata: { ip_address: string, device_info: any }
	): Promise<CanvassItem> {

		return await this.prisma.$transaction(async(tx) => {

			const existingItem = await this.findOne(id, tx as Prisma.TransactionClient)
	
			if (!this.canAccess(existingItem.canvass_id, tx as Prisma.TransactionClient)) {
				throw new ForbiddenException('Only Admin and Owner can update canvass item!')
			}
	
			const data: Prisma.CanvassItemUpdateInput = {
				description: input.description ?? existingItem.description,
				unit: input.unit_id ? { connect: { id: input.unit_id } } : { disconnect: true },
				item: input.item_id ? { connect: { id: input.item_id } } : { disconnect: true },
				quantity: input.quantity,
			}
	
			const updated = await tx.canvassItem.update({
				data,
				where: {
					id
				},
				include: {
					unit: true,
					item: true
				}
			})

			// create audit
			await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.CANVASS_ITEM,
				action: 'UPDATE-CANVASS-ITEM',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as Prisma.TransactionClient)
	
			return updated

		})

	}

	async remove(
		id: string, 
		metadata: { ip_address: string, device_info: any }
	): Promise<WarehouseRemoveResponse> {

		return this.prisma.$transaction(async(tx) => {

			const existingItem = await this.findOne(id, tx as Prisma.TransactionClient)
	
			if (!this.canAccess(existingItem.canvass_id, tx as Prisma.TransactionClient)) {
				throw new ForbiddenException('Only Admin and Owner can remove canvass item!')
			}
	
			await tx.canvassItem.delete({
				where: { id }
			})

			// create audit
			await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.CANVASS_ITEM,
				action: 'DELETE-CANVASS-ITEM',
				reference_id: id,
				metadata: {
					'deleted_value': existingItem,
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as Prisma.TransactionClient)
	
			return {
				success: true,
				msg: "Canvass Item successfully deleted"
			}

		})


	}

	private async canAccess(canvass_id: string, tx?: Prisma.TransactionClient): Promise<boolean> {

		if (isAdmin(this.authUser)) return true

        const prismaClient = tx || this.prisma;

		const canvass = await prismaClient.canvass.findUnique({
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
