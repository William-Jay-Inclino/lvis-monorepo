import { Injectable } from '@nestjs/common';
import { AuthUser } from '../__common__/auth-user.entity';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateMcrtItemSubInput } from '../mcrt/dto/create-mcrt-item.sub.input';

@Injectable()
export class McrtItemService {
  
	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
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
	

}
