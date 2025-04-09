import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Project } from 'apps/warehouse/prisma/generated/client';
import { UpdateProjectInput } from './dto/update-project.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { ProjectsResponse } from './entities/projects-response.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class ProjectService {

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: WarehouseAuditService,
	) { }

	async create(
		input: CreateProjectInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<Project> {

		return await this.prisma.$transaction(async(tx) => {
			const authUser = metadata.authUser
	
			const data: Prisma.ProjectCreateInput = {
				name: input.name,
			}
	
			const created = await tx.project.create({
				data
			})

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.PROJECT,
				action: 'CREATE-PROJECT',
				reference_id: created.id,
				metadata: created,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as unknown as Prisma.TransactionClient)
	
			return created

		})

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

	async update(
		id: string, 
		input: UpdateProjectInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<Project> {

        const authUser = metadata.authUser

		const existingItem = await this.findOne(id)

		return this.prisma.$transaction(async(tx) => {
	
			const data: Prisma.ProjectUpdateInput = {
				name: input.name ?? existingItem.name,
			}
	
			const updated = await tx.project.update({
				data,
				where: {
					id
				}
			})

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.PROJECT,
				action: 'UPDATE-PROJECT',
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

		const existingItem = await this.findOne(id)

		return this.prisma.$transaction(async(tx) => {
			const authUser = metadata.authUser
	
			const updatedItem = await tx.project.update({
				where: { id },
				data: {
				  deleted_at: new Date()
				}
			})

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.PROJECT,
				action: 'SOFT-DELETE-PROJECT',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updatedItem
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as unknown as Prisma.TransactionClient)
	
			return {
				success: true,
				msg: "Project successfully deleted"
			}

		})


	}

	async findProjectsByName(q: string) {
		const input = q.trim(); 
	
		const items = await this.prisma.project.findMany({
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
