import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateSerivItemSubInput } from '../seriv/dto/create-seriv-item.sub.input';
import { CommonService } from '../__common__/classes';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { McrtService } from '../mcrt/mcrt.service';
import { MCRT } from '../mcrt/entities/mcrt.entity';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SerivItemService {
  
	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
        private readonly commonService: CommonService,
        private readonly mcrtService: McrtService,
		private readonly audit: WarehouseAuditService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async updateSerivItems(
		serivId: string, items: CreateSerivItemSubInput[], 
		metadata: { ip_address: string, device_info: any }
	) {
		return this.prisma.$transaction(async (prisma) => {

			const existingSeriv = await prisma.sERIV.findUnique({
				where: { id: serivId },
				include: {
					seriv_items: true
				}
			})

			if(!existingSeriv) {
				throw new NotFoundException('SERIV not found with id: ' + serivId)
			}

			// Validate items first
			await this.commonService.validateItems(items);
	
			const serivItems = existingSeriv.seriv_items
	
			// Decrement `quantity_on_queue` on each item based on previous seriv_items' quantity
			for (let serivItem of serivItems) {
				await prisma.item.update({
					where: { id: serivItem.item_id },
					data: {
						quantity_on_queue: {
							decrement: serivItem.quantity,
						},
					},
				});
			}
	
			// Delete all previous seriv items
			await prisma.sERIVItem.deleteMany({
				where: { seriv_id: serivId },
			});
	
			// Create new seriv items and increment `quantity_on_queue` based on new seriv items' quantities
			for (let item of items) {
				await prisma.sERIVItem.create({
					data: {
						seriv: { connect: { id: serivId } },
						item: { connect: { id: item.item_id } },
						quantity: item.quantity,
						price: item.price,
					},
				});
	
				await prisma.item.update({
					where: { id: item.item_id },
					data: {
						quantity_on_queue: {
							increment: item.quantity,
						},
					},
				});
			}

			const updated_seriv = await prisma.sERIV.findUnique({
				where: { id: serivId },
				include: {
					seriv_items: true
				}
			})

			await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.SERIV_ITEM,
				action: 'UPDATE-SERIV-ITEMS',
				reference_id: serivId,
				metadata: {
					'old_value': existingSeriv,
					'new_value': updated_seriv,
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, prisma as Prisma.TransactionClient)
	

			return updated_seriv;

		});
	}
	
	// MCRT that is approved
	get_qty_returned(mcrts: MCRT[], item_id: string): number {

		let qtyReturned = 0

		for(let mcrt of mcrts) {

			if(!mcrt.is_completed) {
				continue
			}

			const mcrtItem = mcrt.mcrt_items.find(i => i.item_id === item_id)

			if(!mcrtItem) {
				continue
			}

			qtyReturned += mcrtItem.quantity

		}

		return qtyReturned

	}

	// MCRT that is pending
	async get_qty_on_queue(mcrts: MCRT[], item_id: string): Promise<number> {

		let qtyQueue = 0

		for(let mcrt of mcrts) {

			if(mcrt.cancelled_at) {
				continue
			}

			const status = await this.mcrtService.getStatus(mcrt.id)

			if(status === APPROVAL_STATUS.PENDING) {

				const mcrtItem = mcrt.mcrt_items.find(i => i.item_id === item_id)
	
				if(!mcrtItem) {
					continue
				}
	
				qtyQueue += mcrtItem.quantity

			}

		}

		return qtyQueue

	}

}
