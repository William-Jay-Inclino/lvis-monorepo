import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Supplier } from 'apps/warehouse/prisma/generated/client';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { SuppliersResponse } from './entities/suppliers-response.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class SupplierService {

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: WarehouseAuditService,
	) { }

	async create(
		input: CreateSupplierInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<Supplier> {

		return await this.prisma.$transaction(async(tx) => {
			const authUser = metadata.authUser

			const data: Prisma.SupplierCreateInput = {
				name: input.name,
				contact: input.contact,
				tin: input.tin,
				address: input.address,
				is_vat_registered: input.is_vat_registered,
				vat_type: input.vat_type,
				created_by: authUser.user.username
			}
	
			const created = await tx.supplier.create({
				data
			})

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.SUPPLIER,
				action: 'CREATE-SUPPLIER',
				reference_id: created.id,
				metadata: created,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)
	
			return created

		})


	}

    async findAll(page: number, pageSize: number, name?: string): Promise<SuppliersResponse> {
        const skip = (page - 1) * pageSize;
    
        let whereCondition: any = {
            deleted_at: null,
        };
    
        if (name) {
            whereCondition.name = {
                contains: name,
                mode: 'insensitive',
            };
        }
    
        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.supplier.findMany({
                where: whereCondition,
                skip,
                take: pageSize,
            }),
            this.prisma.supplier.count({
                where: whereCondition,
            }),
        ]);
    
        return {
            data: items,
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / pageSize),
        };
    }

	async findOne(id: string): Promise<Supplier | null> {

		const item = await this.prisma.supplier.findUnique({
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Supplier not found')
		}

		return item
	}

	async update(
		id: string, 
		input: UpdateSupplierInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<Supplier> {

        const authUser = metadata.authUser

		const existingItem = await this.findOne(id)

		return await this.prisma.$transaction(async(tx) => {

			const data: Prisma.SupplierUpdateInput = {
				name: input.name ?? existingItem.name,
				contact: input.contact ?? existingItem.contact,
				tin: input.tin ?? existingItem.tin,
				address: input.address ?? existingItem.address,
				is_vat_registered: input.is_vat_registered ?? existingItem.is_vat_registered,
				vat_type: input.vat_type ?? existingItem.vat_type,
				updated_by: authUser.user.username
			}
	
	
			const updated = await tx.supplier.update({
				data,
				where: {
					id
				}
			})

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.SUPPLIER,
				action: 'UPDATE-SUPPLIER',
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

	async remove(
		id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<WarehouseRemoveResponse> {

        const authUser = metadata.authUser

		const existingItem = await this.findOne(id)

		return await this.prisma.$transaction(async(tx) => {
	
			const updatedItem = await tx.supplier.update({
				where: { id },
				data: { deleted_at: new Date() }
			})

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.SUPPLIER,
				action: 'SOFT-DELETE-SUPPLIER',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updatedItem
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)
	
			return {
				success: true,
				msg: "Supplier successfully deleted"
			}

		})


	}

	async findItemsByName(q: string) {
		const input = q.trim(); 
	
		const items = await this.prisma.supplier.findMany({
			select: {
				id: true,
				name: true,
				address: true,
				is_vat_registered: true,
				vat_type: true,
			},
			where: {
				deleted_at: null,
				OR: [
					{ name: { startsWith: input, mode: 'insensitive' } },
				],
			},
			take: 10,
		});
	
		return items;
	}

}
