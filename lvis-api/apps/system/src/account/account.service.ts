import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-account.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Account } from 'apps/system/prisma/generated/client';
import { UpdateAccountInput } from './dto/update-account.input';
import { SystemRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';

@Injectable()
export class AccountService {

  private authUser: AuthUser

  constructor(private readonly prisma: PrismaService) { }

  setAuthUser(authUser: AuthUser) {
    this.authUser = authUser
  }

  async create(input: CreateAccountInput): Promise<Account> {

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

    const created = await this.prisma.account.create({
      data
    })

    return created

  }

  async findAll(): Promise<Account[]> {
    return await this.prisma.account.findMany({
      where: {
        deleted_at: null
      }
    })
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

  async update(id: string, input: UpdateAccountInput): Promise<Account> {

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

    const updated = await this.prisma.account.update({
      data,
      where: {
        id
      }
    })

    return updated

  }

  async remove(id: string): Promise<SystemRemoveResponse> {

    const existingItem = await this.findOne(id)

    await this.prisma.account.update({
      where: { id },
      data: {
        deleted_at: new Date()
      }
    })

    return {
      success: true,
      msg: "Account successfully deleted"
    }

  }

}
