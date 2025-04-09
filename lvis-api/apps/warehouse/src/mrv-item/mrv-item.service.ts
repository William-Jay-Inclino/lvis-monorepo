import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateMrvItemSubInput } from '../mrv/dto/create-mrv-item.sub.input';
import { CommonService } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';
import { Prisma } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class MrvItemService {
  
	constructor(
		private readonly prisma: PrismaService,
        private readonly commonService: CommonService,
		private readonly audit: WarehouseAuditService,
	) { }

	async updateMrvItems(
		mrvId: string, 
		items: CreateMrvItemSubInput[], 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	) {

		return this.prisma.$transaction(async (prisma) => {

			const authUser = metadata.authUser

			const existingMrv = await prisma.mRV.findUnique({
				where: { id: mrvId },
				include: {
					mrv_items: true
				}
			})

			if(!existingMrv) {
				throw new NotFoundException('MRV not found with id: ' + mrvId)
			}

			// Validate items first
			await this.commonService.validateItems(items);
	
			const mrvItems = existingMrv.mrv_items
	
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

			const updated_mrv = await prisma.mRV.findUnique({
				where: { id: mrvId },
				include: {
					mrv_items: true
				}
			})

			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.MRV_ITEM,
				action: 'UPDATE-MRV-ITEMS',
				reference_id: mrvId,
				metadata: {
					'old_value': existingMrv,
					'new_value': updated_mrv,
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, prisma as unknown as Prisma.TransactionClient)
	

			return updated_mrv;

		});
	}


}
