import { Injectable } from '@nestjs/common';
import { AuthUser } from '../__common__/auth-user.entity';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateMstItemSubInput } from '../mst/dto/create-mst-item.sub.input';
import { CommonService } from '../__common__/classes';

@Injectable()
export class MstItemService {
  
	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
        private readonly commonService: CommonService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async updateMstItems(mstId: string, items: CreateMstItemSubInput[]) {
		return this.prisma.$transaction(async (prisma) => {
			// Validate items first
			await this.commonService.validateItems(items);
	
			// Fetch all existing mst items for the given mstId
			const mstItems = await prisma.mSTItem.findMany({
				where: {
					mst_id: mstId,
				},
			});
	
			// Decrement `quantity_on_queue` on each item based on previous mst_items' quantity
			for (let mstItem of mstItems) {
				await prisma.item.update({
					where: { id: mstItem.item_id },
					data: {
						quantity_on_queue: {
							decrement: mstItem.quantity,
						},
					},
				});
			}
	
			// Delete all previous mst items
			await prisma.mSTItem.deleteMany({
				where: { mst_id: mstId },
			});
	
			// Create new mst items and increment `quantity_on_queue` based on new mst items' quantities
			for (let item of items) {
				await prisma.mSTItem.create({
					data: {
						mst: { connect: { id: mstId } },
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

			// Return all mst items after update
			const updatedMstItems = await prisma.mSTItem.findMany({
				where: {
					mst_id: mstId,
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
	
			return updatedMstItems;

		});
	}
	

}
