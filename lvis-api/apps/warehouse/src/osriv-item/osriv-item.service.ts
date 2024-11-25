import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateOsrivItemSubInput } from '../osriv/dto/create-osriv-item.sub.input';
import { CommonService } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class OsrivItemService {
  
	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
        private readonly commonService: CommonService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async updateOsrivItems(osrivId: string, items: CreateOsrivItemSubInput[]) {
		return this.prisma.$transaction(async (prisma) => {
			// Validate items first
			await this.commonService.validateItems(items);
	
			// Fetch all existing osriv items for the given osrivId
			const osrivItems = await prisma.oSRIVItem.findMany({
				where: {
					osriv_id: osrivId,
				},
			});
	
			// Decrement `quantity_on_queue` on each item based on previous osriv_items' quantity
			for (let osrivItem of osrivItems) {
				await prisma.item.update({
					where: { id: osrivItem.item_id },
					data: {
						quantity_on_queue: {
							decrement: osrivItem.quantity,
						},
					},
				});
			}
	
			// Delete all previous osriv items
			await prisma.oSRIVItem.deleteMany({
				where: { osriv_id: osrivId },
			});
	
			// Create new osriv items and increment `quantity_on_queue` based on new osriv items' quantities
			for (let item of items) {
				await prisma.oSRIVItem.create({
					data: {
						osriv: { connect: { id: osrivId } },
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

			// Return all osriv items after update
			const updatedOsrivItems = await prisma.oSRIVItem.findMany({
				where: {
					osriv_id: osrivId,
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
	
			return updatedOsrivItems;

		});
	}
	

}
