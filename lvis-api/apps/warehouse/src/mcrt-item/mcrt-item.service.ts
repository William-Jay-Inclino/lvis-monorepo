import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateMcrtItemSubInput } from '../mcrt/dto/create-mcrt-item.sub.input';
import { MCRT } from '../mcrt/entities/mcrt.entity';
import { SerivItemService } from '../seriv-item/seriv-item.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';
import { Prisma } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class McrtItemService {
  
	constructor(
		private readonly prisma: PrismaService,
		private readonly serivItemService: SerivItemService,
		private readonly audit: WarehouseAuditService,
	) { }

	async updateMcrtItems(
		mcrtId: string, 
		items: CreateMcrtItemSubInput[], 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	) {

		return this.prisma.$transaction(async (prisma) => {

			const authUser = metadata.authUser

			const existingMcrt = await prisma.mCRT.findUnique({
				where: { id: mcrtId },
				include: {
					mcrt_items: true
				}
			})

			if(!existingMcrt) {
				throw new NotFoundException('MCRT not found with id: ' + mcrtId)
			}
	
			// Delete all previous mcrt items
			await prisma.mCRTItem.deleteMany({
				where: { mcrt_id: mcrtId },
			});
	
			// Create new mcrt items
			for (let item of items) {
				await prisma.mCRTItem.create({
					data: {
						mcrt: { connect: { id: mcrtId } },
						item: { connect: { id: item.item_id } },
						quantity: item.quantity,
						price: item.price,
					},
				});
			}

			const updated_mcrt = await prisma.mCRT.findUnique({
				where: { id: mcrtId },
				include: {
					mcrt_items: true
				}
			})

			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.MCRT_ITEM,
				action: 'UPDATE-MCRT-ITEMS',
				reference_id: mcrtId,
				metadata: {
					'old_value': existingMcrt,
					'new_value': updated_mcrt,
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, prisma as Prisma.TransactionClient)
	

			return updated_mcrt;

		});
	}

	get_reference_qty(mcrt: MCRT, item_id: string): number {

		if(mcrt.seriv) {
			
			const item = mcrt.seriv.seriv_items.find(i => i.item_id === item_id)

			if(!item) {
				throw new NotFoundException('item not found in seriv_items with item_id of ', item_id)
			}

			return item.quantity
			
		}

		if(mcrt.mct) {
			
			const item = mcrt.mct.mrv.mrv_items.find(i => i.item_id === item_id)

			if(!item) {
				throw new NotFoundException('item not found in mrv_items with item_id of ', item_id)
			}

			return item.quantity
			
		}

	}

	get_qty_returned(mcrt: MCRT, item_id: string): number {

		if(mcrt.seriv) {
			return this.serivItemService.get_qty_returned(mcrt.seriv.mcrts, item_id)
		}

		if(mcrt.mct) {
			return this.serivItemService.get_qty_returned(mcrt.mct.mcrts, item_id)
		}

	}

	async get_qty_on_queue(mcrt: MCRT, item_id: string): Promise<number> {

		if(mcrt.seriv) {

			// only pass mcrts not equal to this mcrt
			const mcrts = mcrt.seriv.mcrts.filter(i => i.id !== mcrt.id)

			return this.serivItemService.get_qty_on_queue(mcrts, item_id)

		}

		if(mcrt.mct) {

			// only pass mcrts not equal to this mcrt
			const mcrts = mcrt.mct.mcrts.filter(i => i.id !== mcrt.id)

			return this.serivItemService.get_qty_on_queue(mcrts, item_id)

		}

	}

	

}
