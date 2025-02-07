import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-account.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Account } from 'apps/system/prisma/generated/client';
import { UpdateAccountInput } from './dto/update-account.input';
import { SystemRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';
import { AccountsResponse } from './entities/accounts-response.entity';
import { SystemAuditService } from '../system_audit/system_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class AccountService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: SystemAuditService,
    ) { }

    async create(
        input: CreateAccountInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<Account> {

        const authUser = metadata.authUser

        const existingAccount = await this.prisma.account.findUnique({
            where: { code: input.code },
        });
    
        if (existingAccount) {
            throw new Error('Account code must be unique');
        }

        const data: Prisma.AccountCreateInput = {
            code: input.code,
            name: input.name,
        }
        
        return await this.prisma.$transaction(async(tx) => {

            const created = await tx.account.create({
                data
            })

			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.ACCOUNT,
				action: 'CREATE-ACCOUNT',
				reference_id: created.id,
				metadata: created,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)
    
            return created

        })


    }

    async findAll(page: number, pageSize: number, name?: string): Promise<AccountsResponse> {
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
            this.prisma.account.findMany({
                where: whereCondition,
                skip,
                take: pageSize,
            }),
            this.prisma.account.count({
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
    

    async findOne(id: string): Promise<Account | null> {

        const item = await this.prisma.account.findUnique({
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('Account not found')
        }

        return item
    }

    async update(
        id: string, 
        input: UpdateAccountInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<Account> {
        const authUser = metadata.authUser

        const existingItem = await this.findOne(id);
        
        if (input.code && input.code !== existingItem.code) {
            const existingAccount = await this.prisma.account.findUnique({
                where: { code: input.code },
            });
    
            if (existingAccount) {
                throw new Error('Department code must be unique');
            }
        }

        const data: Prisma.AccountUpdateInput = {
            code: input.code ?? existingItem.code,
            name: input.name ?? existingItem.name,
        }

        return await this.prisma.$transaction(async(tx) => {

            const updated = await tx.account.update({
                data,
                where: {
                    id
                }
            })

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.ACCOUNT,
                action: 'UPDATE-ACCOUNT',
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
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<SystemRemoveResponse> {
        const authUser = metadata.authUser

        const existingItem = await this.findOne(id)

        return this.prisma.$transaction(async(tx) => {

            const updatedItem = await tx.account.update({
                where: { id },
                data: {
                    deleted_at: new Date()
                }
            })

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.ACCOUNT,
                action: 'SOFT-DELETE-ACCOUNT',
                reference_id: id,
                metadata: {
                    'old_value': existingItem,
                    'new_value': updatedItem
                },
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
              }, tx as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: "Account successfully deleted"
            }

        })



    }

    async findAccountsByName(q: string) {
		const input = q.trim(); 
	
		const items = await this.prisma.account.findMany({
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
