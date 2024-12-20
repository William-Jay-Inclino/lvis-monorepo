import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Supplier } from 'apps/warehouse/prisma/generated/client';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { SuppliersResponse } from './entities/suppliers-response.entity';

@Injectable()
export class SupplierService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateSupplierInput): Promise<Supplier> {

		const data: Prisma.SupplierCreateInput = {
			name: input.name,
			contact: input.contact,
			tin: input.tin,
			address: input.address,
			is_vat_registered: input.is_vat_registered,
			vat_type: input.vat_type,
			created_by: this.authUser.user.username
		}

		const created = await this.prisma.supplier.create({
			data
		})

		return created

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

	async update(id: string, input: UpdateSupplierInput): Promise<Supplier> {

		const existingItem = await this.findOne(id)

		const data: Prisma.SupplierUpdateInput = {
			name: input.name ?? existingItem.name,
			contact: input.contact ?? existingItem.contact,
			tin: input.tin ?? existingItem.tin,
			address: input.address ?? existingItem.address,
			is_vat_registered: input.is_vat_registered ?? existingItem.is_vat_registered,
			vat_type: input.vat_type ?? existingItem.vat_type,
			updated_by: this.authUser.user.username
		}


		const updated = await this.prisma.supplier.update({
			data,
			where: {
				id
			}
		})

		return updated

	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.supplier.update({
			where: { id },
			data: { deleted_at: new Date() }
		})

		return {
			success: true,
			msg: "Supplier successfully deleted"
		}

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
