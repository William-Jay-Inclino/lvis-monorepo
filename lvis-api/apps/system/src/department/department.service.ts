import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentInput } from './dto/create-department.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Department } from 'apps/system/prisma/generated/client';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { SystemRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';
import { SystemAuditService } from '../system_audit/system_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class DepartmentService {

	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: SystemAuditService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(
		input: CreateDepartmentInput, 
		metadata: { ip_address: string, device_info: any }
	): Promise<Department> {

		// Check if the department code already exists
		const existingDepartment = await this.prisma.department.findUnique({
			where: { code: input.code },
		});
	
		if (existingDepartment) {
			throw new Error('Department code must be unique');
		}

		const data: Prisma.DepartmentCreateInput = {
			code: input.code,
			name: input.name,
		}

		if (input.permissions) {
			data.permissions = JSON.parse(input.permissions)
		}

		return await this.prisma.$transaction(async(tx) => {

			const created = await tx.department.create({
				data
			})

			await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.DEPARTMENT,
				action: 'CREATE-DEPARTMENT',
				reference_id: created.id,
				metadata: created,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)

			if(created.permissions) {
				created.permissions = JSON.stringify(created.permissions)
			}

			return created

		})


	}

	async findAll(): Promise<Department[]> {
		const items = await this.prisma.department.findMany({
			include: {
				divisions: true
			},
			where: {
				deleted_at: null
			}
		})

		return items.map(i => {
			i.permissions = !!i.permissions ? JSON.stringify(i.permissions) : null
			return i
		})

	}

	async findOne(id: string): Promise<Department | null> {

		const item = await this.prisma.department.findUnique({
			where: { id },
			include: {
				divisions: true
			}
		})

		if (!item) {
			throw new NotFoundException('Department not found')
		}

		if(item.permissions) {
			item.permissions = JSON.stringify(item.permissions)
		}

		return item
	}

	async update(
		id: string, 
		input: UpdateDepartmentInput, 
		metadata: { ip_address: string, device_info: any }
	): Promise<Department> {

		const existingItem = await this.prisma.department.findUnique({ where: { id } })
		
		if(!existingItem) {
			throw new NotFoundException('Department not found with id ' + id)
		}

		// Check if the division code is being updated and if the new code already exists
		if (input.code && input.code !== existingItem.code) {
			const existingDepartment = await this.prisma.department.findUnique({
				where: { code: input.code },
			});
	
			if (existingDepartment) {
				throw new Error('Department code must be unique');
			}
		}

		const data: Prisma.DepartmentUpdateInput = {
			code: input.code ?? existingItem.code,
			name: input.name ?? existingItem.name,
		}

		if (input.permissions) {
			data.permissions = JSON.parse(input.permissions)
		}


		return await this.prisma.$transaction(async(tx) => {

			const updated = await tx.department.update({
				data,
				where: {
					id
				}
			})

            await this.audit.createAuditEntry({
                username: this.authUser.user.username,
                table: DB_TABLE.DEPARTMENT,
                action: 'UPDATE-DEPARTMENT',
                reference_id: id,
                metadata: {
                    'old_value': existingItem,
                    'new_value': updated
                },
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)

			if(updated.permissions) {
				updated.permissions = JSON.stringify(updated.permissions)
			}
	
			return updated

		})
		

	}

	async remove(
		id: string,
        metadata: { ip_address: string, device_info: any }
	): Promise<SystemRemoveResponse> {

		const existingItem = await this.prisma.department.findUnique({ where: { id } })
		
		if(!existingItem) {
			throw new NotFoundException('Department not found with id ' + id)
		}

		return this.prisma.$transaction(async(tx) => {

			const updated = await tx.department.update({
				where: { id },
				data: {
					deleted_at: new Date()
				}
			})

            await this.audit.createAuditEntry({
                username: this.authUser.user.username,
                table: DB_TABLE.DEPARTMENT,
                action: 'SOFT-DELETE-DEPARTMENT',
                reference_id: id,
                metadata: {
                    'old_value': existingItem,
                    'new_value': updated 
                },
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)
	
			return {
				success: true,
				msg: "Department successfully deleted"
			}

		})


	}

}
