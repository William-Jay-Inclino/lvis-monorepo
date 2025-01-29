import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassificationInput } from './dto/create-classification.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Classification, Prisma } from 'apps/system/prisma/generated/client';
import { UpdateClassificationInput } from './dto/update-classification.input';
import { SystemRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';
import { ClassificationsResponse } from './entities/classifications-response.entity';
import { SystemAuditService } from '../system_audit/system_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class ClassificationService {

	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: SystemAuditService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(
		input: CreateClassificationInput, 
		metadata: { ip_address: string, device_info: any }
	): Promise<Classification> {

		const data: Prisma.ClassificationCreateInput = {
			name: input.name,
		}


		return await this.prisma.$transaction(async(tx) => {

			const created = await tx.classification.create({
				data
			})

			await this.audit.createAuditEntry({
				username: this.authUser.user.username,
				table: DB_TABLE.CLASSIFICATION,
				action: 'CREATE-CLASSIFICATION',
				reference_id: created.id,
				metadata: created,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)
	
			return created

		})
	}

    async findAll(page: number, pageSize: number, name?: string): Promise<ClassificationsResponse> {
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
            this.prisma.classification.findMany({
                where: whereCondition,
                skip,
                take: pageSize,
            }),
            this.prisma.classification.count({
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

	async findOne(id: string): Promise<Classification | null> {
		const item = await this.prisma.classification.findUnique({
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Classification not found')
		}

		return item
	}

	async update(
		id: string, 
		input: UpdateClassificationInput, 
		metadata: { ip_address: string, device_info: any }
	): Promise<Classification> {

		const existingItem = await this.findOne(id)

		const data: Prisma.ClassificationUpdateInput = {
			name: input.name ?? existingItem.name,
		}

		return await this.prisma.$transaction(async(tx) => {

			const updated = await tx.classification.update({
				data,
				where: {
					id
				}
			})

            await this.audit.createAuditEntry({
                username: this.authUser.user.username,
                table: DB_TABLE.CLASSIFICATION,
                action: 'UPDATE-CLASSIFICATION',
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
        metadata: { ip_address: string, device_info: any }
	): Promise<SystemRemoveResponse> {

		const existingItem = await this.findOne(id)

		return this.prisma.$transaction(async(tx) => {

			const updated = await tx.classification.update({
				where: { id },
				data: {
				  deleted_at: new Date()
				}
			})

            await this.audit.createAuditEntry({
                username: this.authUser.user.username,
                table: DB_TABLE.CLASSIFICATION,
                action: 'SOFT-DELETE-CLASSIFICATION',
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
				msg: "Classification successfully deleted"
			}

		})


	}

	async findClassificationsByName(q: string) {
		const input = q.trim(); 
	
		const items = await this.prisma.classification.findMany({
			where: {
				deleted_at: null,
				OR: [
					{ name: { contains: input, mode: 'insensitive' } },
				],
			},
			take: 10,
		});
	
		return items;
	}

}
