import { Injectable } from '@nestjs/common';
import { AuthUser } from '../__common__/auth-user.entity';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateSerivItemSubInput } from '../seriv/dto/create-seriv-item.sub.input';
import { CommonService } from '../__common__/classes';

@Injectable()
export class SerivItemService {
  
	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
        private readonly commonService: CommonService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async updateSerivItems(serivId: string, items: CreateSerivItemSubInput[]) {
		return this.prisma.$transaction(async (prisma) => {
			// Validate items first
			await this.commonService.validateItems(items);
	
			// Fetch all existing seriv items for the given serivId
			const serivItems = await prisma.sERIVItem.findMany({
				where: {
					seriv_id: serivId,
				},
			});
	
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

			// Return all seriv items after update
			const updatedSerivItems = await prisma.sERIVItem.findMany({
				where: {
					seriv_id: serivId,
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
	
			return updatedSerivItems;

		});
	}
	

}
