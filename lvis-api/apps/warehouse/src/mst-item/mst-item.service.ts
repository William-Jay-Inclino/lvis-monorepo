import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateMstItemSubInput } from '../mst/dto/create-mst-item.sub.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';
import { Prisma } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class MstItemService {
  
	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: WarehouseAuditService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async updateMstItems(
		mstId: string, 
		items: CreateMstItemSubInput[], 
		metadata: { ip_address: string, device_info: any }
	) {
		return this.prisma.$transaction(async (prisma) => {

			const existingMst = await prisma.mST.findUnique({
				where: { id: mstId },
				include: {
					mst_items: true
				}
			})
	
			if(!existingMst) {
				throw new NotFoundException('MST not found with id: ' + mstId)
			}
			
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
					},
				});
			}

			const updated_mst = await prisma.mST.findUnique({
				where: { id: mstId },
				include: {
					mst_items: true
				}
			})

			await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.MST_ITEM,
				action: 'UPDATE-MST-ITEMS',
				reference_id: mstId,
				metadata: {
					'old_value': existingMst,
					'new_value': updated_mst,
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, prisma as Prisma.TransactionClient)
	

			return updated_mst;

		});
	}
	

}
