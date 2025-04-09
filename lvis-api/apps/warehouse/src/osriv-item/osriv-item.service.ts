import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateOsrivItemSubInput } from '../osriv/dto/create-osriv-item.sub.input';
import { CommonService } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';
import { Prisma } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class OsrivItemService {
  
	constructor(
		private readonly prisma: PrismaService,
        private readonly commonService: CommonService,
		private readonly audit: WarehouseAuditService,
	) { }

	async updateOsrivItems(
		osrivId: string, 
		items: CreateOsrivItemSubInput[], 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	) {
		return this.prisma.$transaction(async (prisma) => {

			const authUser = metadata.authUser

			const existingOsriv = await prisma.oSRIV.findUnique({
				where: { id: osrivId },
				include: {
					osriv_items: true
				}
			})

			if(!existingOsriv) {
				throw new NotFoundException('OSRIV not found with id: ' + osrivId)
			}

			// Validate items first
			await this.commonService.validateItems(items);
	
			const osrivItems = existingOsriv.osriv_items
	
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

			const updated_osriv = await prisma.oSRIV.findUnique({
				where: { id: osrivId },
				include: {
					osriv_items: true
				}
			})

			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.OSRIV_ITEM,
				action: 'UPDATE-OSRIV-ITEMS',
				reference_id: osrivId,
				metadata: {
					'old_value': existingOsriv,
					'new_value': updated_osriv,
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, prisma as unknown as Prisma.TransactionClient)
	

			return updated_osriv;

		});
	}
	

}
