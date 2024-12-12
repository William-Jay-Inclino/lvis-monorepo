import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Project } from 'apps/warehouse/prisma/generated/client';
import { UpdateProjectInput } from './dto/update-project.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { ProjectsResponse } from './entities/projects-response.entity';

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
		}

		const created = await this.prisma.project.create({
			data
		})

		return created

	}

    async findAll(page: number, pageSize: number, name?: string): Promise<ProjectsResponse> {
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
            this.prisma.project.findMany({
                where: whereCondition,
                skip,
                take: pageSize,
            }),
            this.prisma.project.count({
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

	async findOne(id: string): Promise<Project | null> {

		const item = await this.prisma.project.findUnique({
			where: { id },
			include: {
				project_items: {
					include: {
						item: {
							select: {
								code: true,
								description: true,
								total_quantity: true,
								unit: true,
							}
						}
					}
				}
			},
		})

		if (!item) {
			throw new NotFoundException('Project not found')
		}

		return item
	}

	async update(id: string, input: UpdateProjectInput): Promise<Project> {

		const existingItem = await this.findOne(id)

		const data: Prisma.ProjectUpdateInput = {
			name: input.name ?? existingItem.name,
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
			  deleted_at: new Date()
			}
		})

		return {
			success: true,
			msg: "Project successfully deleted"
		}

	}

	async findProjectsByName(q: string) {
		const input = q.trim(); 
	
		const items = await this.prisma.project.findMany({
			where: {
				deleted_at: null,
				OR: [
					{ name: { startsWith: input } },
				],
			},
			take: 10,
		});
	
		return items;
	}

}
