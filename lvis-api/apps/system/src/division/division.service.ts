import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDivisionInput } from './dto/create-division.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Division, Prisma } from 'apps/system/prisma/generated/client';
import { UpdateDivisionInput } from './dto/update-division.input';
import { SystemRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';
import { SystemAuditService } from '../system_audit/system_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class DivisionService {

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: SystemAuditService,
	) { }

	async create(
		input: CreateDivisionInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<Division> {

        const authUser = metadata.authUser

		// Check if the division code already exists
		const existingDivision = await this.prisma.division.findUnique({
			where: { code: input.code },
		});
	
		if (existingDivision) {
			throw new Error('Division code must be unique');
		}
	
		const data: Prisma.DivisionCreateInput = {
			name: input.name,
			code: input.code,
			department: { connect: { id: input.department_id } },
		};
	
		if (input.permissions) {
			data.permissions = JSON.parse(input.permissions);
		}
	
		return await this.prisma.$transaction(async(tx) => {

			const created = await tx.division.create({ data });

			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.DIVISION,
				action: 'CREATE-DIVISION',
				reference_id: created.id,
				metadata: created,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as unknown as Prisma.TransactionClient)
		
			if (created.permissions) {
				created.permissions = JSON.stringify(created.permissions);
			}
		
			return created;
		})

	}

	async findAll(): Promise<Division[]> {
		const items = await this.prisma.division.findMany({
			orderBy: {
				name: 'asc'
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

	async findOne(id: string): Promise<Division | null> {
		const item = await this.prisma.division.findUnique({
			where: { id },
			include: {
				department: true,
				employees: true,
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

	async update(
		id: string, 
		input: UpdateDivisionInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<Division> {

        const authUser = metadata.authUser

		const existingItem = await this.prisma.division.findUnique({ where: { id } })

		if(!existingItem) {
			throw new NotFoundException('Division not found with id ' + id)
		} 
	
		// Check if the division code is being updated and if the new code already exists
		if (input.code && input.code !== existingItem.code) {
			const existingDivision = await this.prisma.division.findUnique({
				where: { code: input.code },
			});
	
			if (existingDivision) {
				throw new Error('Division code must be unique');
			}
		}
	
		const data: Prisma.DivisionUpdateInput = {
			code: input.code ?? existingItem.code,
			department: input.department_id ? { connect: { id: input.department_id } } : { connect: { id: existingItem.department_id } },
			name: input.name ?? existingItem.name,
		};
	
		if (input.permissions) {
			data.permissions = JSON.parse(input.permissions);
		}
		
		return await this.prisma.$transaction(async(tx) => {

			const updated = await tx.division.update({
				data,
				where: {
					id,
				},
			});

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.DIVISION,
                action: 'UPDATE-DIVISION',
                reference_id: id,
                metadata: {
                    'old_value': existingItem,
                    'new_value': updated
                },
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
		
			if (updated.permissions) {
				updated.permissions = JSON.stringify(updated.permissions);
			}
		
			return updated;

		})

	}

	async remove(
		id: string,
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<SystemRemoveResponse> {

        const authUser = metadata.authUser

		const existingItem = await this.prisma.division.findUnique({ where: { id } })

		if(!existingItem) {
			throw new NotFoundException('Division not found with id ' + id)
		} 

        return this.prisma.$transaction(async(tx) => {

            const updatedItem = await tx.division.update({
                where: { id },
                data: {
                    deleted_at: new Date()
                }
            })

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.DIVISION,
                action: 'SOFT-DELETE-DIVISION',
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
                msg: "Division successfully deleted"
            }

        })

	}

}
