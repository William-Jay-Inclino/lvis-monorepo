import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDivisionInput } from './dto/create-division.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Division, Prisma } from 'apps/system/prisma/generated/client';
import { UpdateDivisionInput } from './dto/update-division.input';
import { SystemRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';

@Injectable()
export class DivisionService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateDivisionInput): Promise<Division> {

		const data: Prisma.DivisionCreateInput = {
			name: input.name,
			code: input.code,
			department: { connect: { id: input.department_id } },
		}

		if (input.permissions) {
		data.permissions = JSON.parse(input.permissions)
		}

		const created = await this.prisma.division.create({ data })

		if(created.permissions) {
			created.permissions = JSON.stringify(created.permissions)
		}

		return created
	}

	async findAll(): Promise<Division[]> {
		const items = await this.prisma.division.findMany({
			orderBy: {
				name: 'asc'
			}
		})

		return items.map(i => {
			i.permissions = !!i.permissions ? JSON.stringify(i.permissions) : null
			return i
		})
	}

	async findOne(id: string): Promise<Division | null> {
		const item = await this.prisma.division.findUnique({
			where: { id },
			include: {
				department: true
			}
		})

		if (!item) {
			throw new NotFoundException('Division not found')
		}

		if(item.permissions) {
			item.permissions = JSON.stringify(item.permissions)
		}

		return item
	}

	async update(id: string, input: UpdateDivisionInput): Promise<Division> {

		const existingItem = await this.findOne(id)

		const data: Prisma.DivisionUpdateInput = {
			code: input.code ?? existingItem.code,
			department: input.department_id ? { connect: { id: input.department_id } } : { connect: { id: existingItem.department_id } },
			name: input.name ?? existingItem.name,
		}

		if (input.permissions) {
			data.permissions = JSON.parse(input.permissions)
		}

		const updated = await this.prisma.division.update({
			data,
			where: {
				id
			}
		})

		if(updated.permissions) {
			updated.permissions = JSON.stringify(updated.permissions)
		}

		return updated
	}

	async remove(id: string): Promise<SystemRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.division.delete({
			where: { id }
		})

		return {
			success: true,
			msg: "Division successfully deleted"
		}

	}

}
