import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceCenterInput } from './dto/create-service-center.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { ServiceCenter, Prisma } from 'apps/warehouse/prisma/generated/client';
import { UpdateServiceCenterInput } from './dto/update-service-center.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class ServiceCenterService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateServiceCenterInput): Promise<ServiceCenter> {

		const data: Prisma.ServiceCenterCreateInput = {
			name: input.name,
			location: input.location,
			contact_person: input.contact_person,
			contact_number: input.contact_number,
			remarks: input.remarks,
		}

		const created = await this.prisma.serviceCenter.create({ data })

		return created
	}

    async findAll(): Promise<ServiceCenter[]> {
        return await this.prisma.serviceCenter.findMany()
    }

	async findOne(id: string): Promise<ServiceCenter | null> {
		const item = await this.prisma.serviceCenter.findUnique({
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('ServiceCenter not found')
		}

		return item
	}

	async update(id: string, input: UpdateServiceCenterInput): Promise<ServiceCenter> {

		const existingItem = await this.findOne(id)

		const data: Prisma.ServiceCenterUpdateInput = {
			name: input.name ?? existingItem.name,
			location: input.location ?? existingItem.location,
			contact_person: input.contact_person ?? existingItem.contact_person,
			contact_number: input.contact_number ?? existingItem.contact_number,
			remarks: input.remarks ?? existingItem.remarks,
		}

		const updated = await this.prisma.serviceCenter.update({
			data,
			where: {
				id
			}
		})

		return updated
	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.serviceCenter.delete({
			where: { id }
		})

		return {
			success: true,
			msg: "Service Center successfully deleted"
		}

	}

}
