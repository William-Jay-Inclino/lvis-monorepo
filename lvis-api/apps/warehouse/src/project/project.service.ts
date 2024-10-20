import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Project } from 'apps/warehouse/prisma/generated/client';
import { UpdateProjectInput } from './dto/update-project.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';

@Injectable()
export class ProjectService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateProjectInput): Promise<Project> {

		const data: Prisma.ProjectCreateInput = {
			name: input.name,
			created_by: this.authUser.user.username
		}

		const created = await this.prisma.project.create({
			data
		})

		return created

	}

	async findAll(): Promise<Project[]> {
		return await this.prisma.project.findMany({
			where: {
				deleted_at: null
			}
		})
	}

	async findOne(id: string): Promise<Project | null> {

		const item = await this.prisma.project.findUnique({
			where: { id }
		})

		console.log('item', item, id)

		if (!item) {
			throw new NotFoundException('Project not found')
		}

		return item
	}

	async update(id: string, input: UpdateProjectInput): Promise<Project> {

		const existingItem = await this.findOne(id)

		const data: Prisma.ProjectUpdateInput = {
			name: input.name ?? existingItem.name,
			updated_by: this.authUser.user.username
		}


		const updated = await this.prisma.project.update({
			data,
			where: {
				id
			}
		})

		return updated

	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.project.update({
			where: { id },
			data: {
				deleted_at: new Date(),
				deleted_by: this.authUser.user.username
			}
		})

		return {
			success: true,
			msg: "Project successfully deleted"
		}

	}

}
