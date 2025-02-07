import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitInput } from './dto/create-unit.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Unit } from 'apps/warehouse/prisma/generated/client';
import { UpdateUnitInput } from './dto/update-unit.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class UnitService {

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: WarehouseAuditService,
	) { }

	async create(input: CreateUnitInput, metadata: { ip_address: string, device_info: any, authUser: AuthUser }): Promise<Unit> {

		return await this.prisma.$transaction(async(tx) => {
			const authUser = metadata.authUser

			const data: Prisma.UnitCreateInput = {
				name: input.name,
			}
	
			const created = await tx.unit.create({
				data
			})

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.UNIT,
				action: 'CREATE-UNIT',
				reference_id: created.id,
				metadata: created,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)
	
			return created

		})


	}

	async findAll(): Promise<Unit[]> {
		return await this.prisma.unit.findMany({
			orderBy: {
				name: 'asc'
			}
		})
	}

	async findOne(id: string): Promise<Unit | null> {

		const item = await this.prisma.unit.findUnique({
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Unit not found')
		}

		return item
	}

	async update(id: string, input: UpdateUnitInput, metadata: { ip_address: string, device_info: any, authUser: AuthUser }): Promise<Unit> {
        const authUser = metadata.authUser

		const existingItem = await this.findOne(id)

		return await this.prisma.$transaction(async(tx) => {
	
			const data: Prisma.UnitUpdateInput = {
				name: input.name ?? existingItem.name,
			}
	
			const updated = await tx.unit.update({
				data,
				where: {
					id
				}
			})

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.UNIT,
				action: 'UPDATE-UNIT',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)
	
			return updated

		})


	}

	async remove(id: string, metadata: { ip_address: string, device_info: any, authUser: AuthUser }): Promise<WarehouseRemoveResponse> {
        const authUser = metadata.authUser

		const existingItem = await this.findOne(id)

		return await this.prisma.$transaction(async(tx) => {
	
			await tx.unit.delete({
				where: { id }
			})

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.UNIT,
				action: 'DELETE-UNIT',
				reference_id: id,
				metadata: {
					'deleted_value': existingItem,
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)
	
			return {
				success: true,
				msg: "Unit successfully deleted"
			}

		})


	}

}
