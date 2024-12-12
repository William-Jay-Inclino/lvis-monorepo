import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassificationInput } from './dto/create-classification.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Classification, Prisma } from 'apps/system/prisma/generated/client';
import { UpdateClassificationInput } from './dto/update-classification.input';
import { SystemRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';
import { ClassificationsResponse } from './entities/classifications-response.entity';

@Injectable()
export class ClassificationService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateClassificationInput): Promise<Classification> {

		const data: Prisma.ClassificationCreateInput = {
			name: input.name,
		}

		const created = await this.prisma.classification.create({ data })

		return created
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

	async update(id: string, input: UpdateClassificationInput): Promise<Classification> {

		const existingItem = await this.findOne(id)

		const data: Prisma.ClassificationUpdateInput = {
			name: input.name ?? existingItem.name,
		}

		const updated = await this.prisma.classification.update({
			data,
			where: {
				id
			}
		})

		return updated
	}

	async remove(id: string): Promise<SystemRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.classification.update({
			where: { id },
			data: {
			  deleted_at: new Date()
			}
		})

		return {
			success: true,
			msg: "Classification successfully deleted"
		}

	}

	async findClassificationsByName(q: string) {
		const input = q.trim(); 
	
		const items = await this.prisma.classification.findMany({
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
