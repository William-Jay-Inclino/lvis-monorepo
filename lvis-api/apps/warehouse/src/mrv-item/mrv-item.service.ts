import { Injectable } from '@nestjs/common';
import { AuthUser } from '../__common__/auth-user.entity';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateMrvItemSubInput } from '../mrv/dto/create-mrv-item.sub.input';
import { CommonService } from '../__common__/classes';

@Injectable()
export class MrvItemService {
  
	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
        private readonly commonService: CommonService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async updateMrvItems(mrvId: string, items: CreateMrvItemSubInput[]) {
		return this.prisma.$transaction(async (prisma) => {
			// Validate items first
			await this.commonService.validateItems(items);
	
			// Fetch all existing mrv items for the given mrvId
			const mrvItems = await prisma.mRVItem.findMany({
				where: {
					mrv_id: mrvId,
				},
			});
	
			// Decrement `quantity_on_queue` on each item based on previous mrv_items' quantity
			for (let mrvItem of mrvItems) {
				await prisma.item.update({
					where: { id: mrvItem.item_id },
					data: {
						quantity_on_queue: {
							decrement: mrvItem.quantity,
						},
					},
				});
			}
	
			// Delete all previous mrv items
			await prisma.mRVItem.deleteMany({
				where: { mrv_id: mrvId },
			});
	
			// Create new mrv items and increment `quantity_on_queue` based on new mrv items' quantities
			for (let item of items) {
				await prisma.mRVItem.create({
					data: {
						mrv: { connect: { id: mrvId } },
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

			// Return all mrv items after update
			const updatedMrvItems = await prisma.mRVItem.findMany({
				where: {
					mrv_id: mrvId,
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
	
			return updatedMrvItems;

		});
	}
	

}
