import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { UpdateUserInput } from './dto/update-user.input';
import { Prisma, Role, User } from 'apps/system/prisma/generated/client';
import { AuthUser } from '../__common__/auth-user.entity';
import { UsersResponse } from './entities/users-response.entity';
import { decrypt_password, encrypt_password } from '../__common__/helpers';
import { USER_GROUP } from '../__common__/constants';
import { SystemAuditService } from '../system_audit/system_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class UserService {

  private readonly secretKey = process.env.CRYPTO_SECRET_KEY;

  private includedFields = {
    user_employee: {
      include: {
        employee: {
          include: {
            division: true,
            department: true,
          }
        }
      }
    }
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: SystemAuditService,
  ) { }

  async create(
    input: CreateUserInput, 
		metadata: { ip_address: string, device_info: any, authUser?: AuthUser }
  ): Promise<User> {

    const authUser = metadata.authUser

    const created_by = authUser ? authUser.user.username : 'Initial'
    const encrypted_password = encrypt_password(input.password, this.secretKey)

    const data: Prisma.UserCreateInput = {
      username: input.username,
      password: encrypted_password,
      firstname: input.firstname,
      middlename: input.middlename,
      lastname: input.lastname,
      role: input.role ?? Role.USER,
      created_by
    }

    if (input.permissions) {
      data.permissions = JSON.parse(input.permissions)
    }

    if (input.employee_id) {
      data.user_employee = {
        create: {
          created_by,
          employee: {
            connect: { id: input.employee_id }
          }
        }
      }
    }

    return await this.prisma.$transaction(async(tx) => {

      const created = await tx.user.create({ data })

      await this.audit.createAuditEntry({
        username: authUser.user.username,
        table: DB_TABLE.USER,
        action: 'CREATE-USER',
        reference_id: created.id,
        metadata: created,
        ip_address: metadata.ip_address,
        device_info: metadata.device_info
      }, tx as Prisma.TransactionClient)
  
      return created
    })

  }

  async findAll(
    page: number,
    pageSize: number,
    searchValue?: string
  ): Promise<UsersResponse> {

    const skip = (page - 1) * pageSize;

    let whereCondition: any = {
      username: {
        not: 'admin'
      }
    };

    if (!!searchValue) {
      whereCondition = { username: { contains: searchValue.trim(), mode: 'insensitive' } }
    }

    const items = await this.prisma.user.findMany({
      include: this.includedFields,
      orderBy: [{ lastname: 'asc' }, { firstname: 'asc' }],
      skip,
      take: pageSize,
      where: whereCondition,
    });

    const totalItems = await this.prisma.user.count({
      where: whereCondition,
    });


    // remove user with username of admin
    const indx = items.findIndex(i => i.username === 'admin')
    if (indx !== -1) {
      items.splice(indx, 1)
    }

    return {
      data: items,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  async findOne(id: string): Promise<User | null> {

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: this.includedFields

    })

    if (!user) {
      throw new NotFoundException("User not found with id of " + id)
    }

    user.permissions = JSON.stringify(user.permissions)

    return user

  }

  async findByUserName(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: this.includedFields

    })

    if (!user) {
      throw new NotFoundException("User not found with username of " + username)
    }

    user.permissions = JSON.stringify(user.permissions)

    if(user.user_employee) {
      user.user_employee.employee['is_budget_officer'] = await this.is_budget_officer(user.id)
      user.user_employee.employee['is_finance_manager'] = await this.is_finance_manager(user.id)
    }

    return user

  }

  async update(
    id: string, 
    input: UpdateUserInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
  ): Promise<User> {

    const authUser = metadata.authUser

    const existingUser = await this.prisma.user.findUnique({
      where: { id }
    })

    if(!existingUser) {
      throw new NotFoundException('User not found with id ' + id)
    }

    const data: Prisma.UserUpdateInput = {
      updated_by: authUser.user.username,
      password: input.password ? encrypt_password(input.password, this.secretKey) : existingUser.password,
      firstname: input.firstname ?? existingUser.firstname,
      middlename: input.middlename ?? existingUser.middlename,
      lastname: input.lastname ?? existingUser.lastname,
      role: input.role ?? existingUser.role,
      status: input.status ?? existingUser.status,
    }

    if (input.permissions) {
      data.permissions = JSON.parse(input.permissions)
    }

    return await this.prisma.$transaction(async(tx) => {

      const updated = await tx.user.update({
        where: { id },
        data
      })

      await this.audit.createAuditEntry({
        username: authUser.user.username,
        table: DB_TABLE.USER,
        action: 'UPDATE-USER',
        reference_id: id,
        metadata: {
            'old_value': existingUser,
            'new_value': updated
        },
        ip_address: metadata.ip_address,
        device_info: metadata.device_info
    }, tx as Prisma.TransactionClient)

      return updated

    })


  }

  async isUsernameExist(username: string): Promise<boolean> {

    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true
      }
    })

    if (user) {
      return true
    }

    return false

  }

  async change_password(
    user_id: string, 
    new_password: string,
    metadata: { ip_address: string, device_info: any, authUser: AuthUser }
  ): Promise<{ success: boolean, msg: string}> {

    const authUser = metadata.authUser

    const user = await this.prisma.user.findUnique({
      where: { id: user_id }
    })

    if(!user) {
      throw new NotFoundException("User not found with id of " + user_id)
    }

    const encrypted_pw = encrypt_password(new_password, this.secretKey)

    return this.prisma.$transaction(async(tx) => {

      const updated_user = await tx.user.update({
        where: { id: user_id },
        data: {
          password: encrypted_pw,
        }
      })

      await this.audit.createAuditEntry({
        username: authUser.user.username,
        table: DB_TABLE.USER,
        action: 'CHANGE-PASSWORD-OF-USER',
        reference_id: user_id,
        ip_address: metadata.ip_address,
        device_info: metadata.device_info
      }, tx as Prisma.TransactionClient)

      return {
        success: true,
        msg: "Password changed successfully",
      }

    })



  }

  async change_own_password(
    new_pw: string, 
    current_pw: string,
    metadata: { ip_address: string, device_info: any, authUser: AuthUser }
  ): Promise<{ success: boolean, msg: string}> {

    const authUser = metadata.authUser

    const user_id = authUser.user.id 

    const user = await this.prisma.user.findUnique({
      where: { id: authUser.user.id }
    })

    if(!user) {
      throw new NotFoundException("User not found with id of " + user_id)
    }

    const decrypted_user_pass = decrypt_password(user.password, this.secretKey)

    if(current_pw !== decrypted_user_pass) {
      return {
        success: false,
        msg: "Current password is incorrect"
      }
    }

    const encrypted_pw = encrypt_password(new_pw, this.secretKey)

    return this.prisma.$transaction(async(tx) => {

      const updated_user = await tx.user.update({
        where: { id: user_id },
        data: {
          password: encrypted_pw,
        }
      })

      await this.audit.createAuditEntry({
        username: authUser.user.username,
        table: DB_TABLE.USER,
        action: 'CHANGE-OWN-PASSWORD',
        reference_id: user_id,
        ip_address: metadata.ip_address,
        device_info: metadata.device_info
      }, tx as Prisma.TransactionClient)
  
      return {
        success: true,
        msg: "Password changed successfully",
      }

    })


  }

  private async is_budget_officer(user_id: string): Promise<boolean> {

    const x = await this.prisma.userGroupMembers.findUnique({
      where: {
        user_id_user_group_id: {
          user_id,
          user_group_id: USER_GROUP.BUDGET_OFFICER
        }
      }
    })

    if(x) {
      return true 
    }

    return false 

  }

  private async is_finance_manager(user_id: string): Promise<boolean> {

    const x = await this.prisma.userGroupMembers.findUnique({
      where: {
        user_id_user_group_id: {
          user_id,
          user_group_id: USER_GROUP.FINANCE_MANAGER
        }
      }
    })

    if(x) {
      return true 
    }
    
    return false 

  }

}
