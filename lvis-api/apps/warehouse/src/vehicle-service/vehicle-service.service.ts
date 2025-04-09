import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleServiceInput } from './dto/create-vehicle-service.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { VehicleService, Prisma } from 'apps/warehouse/prisma/generated/client';
import { UpdateVehicleServiceInput } from './dto/update-vehicle-service.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class VehicleServiceService {

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: WarehouseAuditService,
	) { }

	async create(
		input: CreateVehicleServiceInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<VehicleService> {

        const authUser = metadata.authUser

		const data: Prisma.VehicleServiceCreateInput = {
			name: input.name,
		}

		return await this.prisma.$transaction(async(tx) => {

			const created = await tx.vehicleService.create({ data })
			
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.VEHICLE_MAINTENANCE_DETAIL,
				action: 'CREATE-VEHICLE-MAINTENANCE-DETAIL',
				reference_id: created.id,
				metadata: created,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as unknown as Prisma.TransactionClient)

			return created

		})

	}

    async findAll(): Promise<VehicleService[]> {
        return await this.prisma.vehicleService.findMany()
    }

	async findOne(id: string): Promise<VehicleService | null> {
		const item = await this.prisma.vehicleService.findUnique({
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Vehicle Service not found')
		}

		return item
	}

	async update(
		id: string, 
		input: UpdateVehicleServiceInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<VehicleService> {

        const authUser = metadata.authUser

		const existingItem = await this.findOne(id)

		const data: Prisma.VehicleServiceUpdateInput = {
			name: input.name ?? existingItem.name,
		}

		return await this.prisma.$transaction(async(tx) => {

			const updated = await tx.vehicleService.update({
				data,
				where: {
					id
				}
			})

			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.VEHICLE_MAINTENANCE_DETAIL,
				action: 'UPDATE-VEHICLE-MAINTENANCE-DETAIL',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as unknown as Prisma.TransactionClient)
	
			return updated

		})

	}

	async remove(
		id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<WarehouseRemoveResponse> {
		
        const authUser = metadata.authUser

		const existingItem = await this.findOne(id)

		return await this.prisma.$transaction(async(tx) => {

			const deletedItem = await tx.vehicleService.delete({
				where: { id }
			})
			
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.VEHICLE_MAINTENANCE_DETAIL,
				action: 'DELETE-VEHICLE-MAINTENANCE-DETAIL',
				reference_id: id,
				metadata: {
					'deleted_value': deletedItem,
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as unknown as Prisma.TransactionClient)

			return {
				success: true,
				msg: "Vehicle Service successfully deleted"
			}

		})


	}

}
