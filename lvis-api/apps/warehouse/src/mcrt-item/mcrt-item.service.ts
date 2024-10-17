import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../__common__/auth-user.entity';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateMcrtItemSubInput } from '../mcrt/dto/create-mcrt-item.sub.input';
import { MCRT } from '../mcrt/entities/mcrt.entity';
import { SerivItemService } from '../seriv-item/seriv-item.service';

@Injectable()
export class McrtItemService {
  
	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
		private readonly serivItemService: SerivItemService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async updateMcrtItems(mcrtId: string, items: CreateMcrtItemSubInput[]) {
		return this.prisma.$transaction(async (prisma) => {
	
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
						created_by: this.authUser.user.username,
					},
				});
			}

			// Return all mcrt items after update
			const updatedMcrtItems = await prisma.mCRTItem.findMany({
				where: {
					mcrt_id: mcrtId,
				},
				include: {
					item: {
						include: {
							item_type: true,
							unit: true,
							item_transactions: true,
						}
					} 
				}
			});
	
			return updatedMcrtItems;

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

		console.log('mcrt', mcrt);

		if(mcrt.seriv) {
			return this.serivItemService.get_qty_returned(mcrt.seriv.mcrts, item_id)
		}

		if(mcrt.mct) {
			return this.serivItemService.get_qty_returned(mcrt.mct.mcrts, item_id)
		}

	}

	async get_qty_on_queue(mcrt: MCRT, item_id: string): Promise<number> {

		if(mcrt.seriv) {
			return this.serivItemService.get_qty_on_queue(mcrt.seriv.mcrts, item_id)
		}

		if(mcrt.mct) {
			return this.serivItemService.get_qty_on_queue(mcrt.mct.mcrts, item_id)
		}

	}

	

}
