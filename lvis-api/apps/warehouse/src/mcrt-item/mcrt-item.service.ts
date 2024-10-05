import { Injectable } from '@nestjs/common';
import { AuthUser } from '../__common__/auth-user.entity';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateMcrtItemSubInput } from '../mcrt/dto/create-mcrt-item.sub.input';
import { CommonService } from '../__common__/classes';

@Injectable()
export class McrtItemService {
  
	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
        private readonly commonService: CommonService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async updateMcrtItems(mcrtId: string, items: CreateMcrtItemSubInput[]) {
		return this.prisma.$transaction(async (prisma) => {
			// Validate items first
			await this.commonService.validateItems(items);
	
			// Fetch all existing mcrt items for the given mcrtId
			const mcrtItems = await prisma.mCRTItem.findMany({
				where: {
					mcrt_id: mcrtId,
				},
			});
	
			// Decrement `quantity_on_queue` on each item based on previous mcrt_items' quantity
			for (let mcrtItem of mcrtItems) {
				await prisma.item.update({
					where: { id: mcrtItem.item_id },
					data: {
						quantity_on_queue: {
							decrement: mcrtItem.quantity,
						},
					},
				});
			}
	
			// Delete all previous mcrt items
			await prisma.mCRTItem.deleteMany({
				where: { mcrt_id: mcrtId },
			});
	
			// Create new mcrt items and increment `quantity_on_queue` based on new mcrt items' quantities
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
	
				await prisma.item.update({
					where: { id: item.item_id },
					data: {
						quantity_on_queue: {
							increment: item.quantity,
						},
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
	

}
