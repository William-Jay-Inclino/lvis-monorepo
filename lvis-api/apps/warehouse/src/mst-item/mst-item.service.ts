import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateMstItemSubInput } from '../mst/dto/create-mst-item.sub.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class MstItemService {
  
	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async updateMstItems(mstId: string, items: CreateMstItemSubInput[]) {
		return this.prisma.$transaction(async (prisma) => {
	
			// Delete all previous mst items
			await prisma.mSTItem.deleteMany({
				where: { mst_id: mstId },
			});
	
			// Create new mst items
			for (let item of items) {
				await prisma.mSTItem.create({
					data: {
						mst: { connect: { id: mstId } },
						item: { connect: { id: item.item_id } },
						quantity: item.quantity,
						price: item.price,
						status: item.status,
						created_by: this.authUser.user.username,
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
