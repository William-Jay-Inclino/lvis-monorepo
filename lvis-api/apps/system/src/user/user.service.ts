import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { UpdateUserInput } from './dto/update-user.input';
import { Prisma, Role, User } from 'apps/system/prisma/generated/client';
import { AuthUser } from '../__common__/auth-user.entity';
import { UsersResponse } from './entities/users-response.entity';
import { SystemRemoveResponse } from '../__common__/classes';
import { decrypt_password, encrypt_password } from '../__common__/helpers';

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);
  private authUser: AuthUser
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

  constructor(private readonly prisma: PrismaService) { }

  setAuthUser(authUser: AuthUser) {
    this.authUser = authUser
  }

  async create(input: CreateUserInput): Promise<User> {

    const created_by = this.authUser ? this.authUser.user.username : 'Initial'
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

    const created = await this.prisma.user.create({ data })

    return created
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
      return null
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
      return null
    }

    user.permissions = JSON.stringify(user.permissions)

    return user

  }

  async update(id: string, input: UpdateUserInput): Promise<User> {

    const existingUser = await this.findOne(id)

    const data: Prisma.UserUpdateInput = {
      updated_by: this.authUser.user.username,
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

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      include: this.includedFields
    })

    return updated


  }

  async remove(id: string): Promise<SystemRemoveResponse> {

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        user_employee: true
      }
    })

    // if user is not employee
    if (!user.user_employee) {

      const result = await this.prisma.user.delete({
        where: { id }
      })

      return {
        success: true,
        msg: "User successfully deleted"
      }

    }

    // if user is employee then delete record in user_employee table

    const query1 = this.prisma.user.delete({
      where: { id }
    })

    const query2 = this.prisma.userEmployee.delete({
      where: {
        user_id: id
      }
    })

    const result = await this.prisma.$transaction([query1, query2])

    return {
      success: true,
      msg: "User successfully deleted"
    }

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

  async change_password(user_id: string, new_password: string): Promise<{ success: boolean, msg: string}> {

    const user = await this.prisma.user.findUnique({
      where: { id: user_id }
    })

    if(!user) {
      throw new NotFoundException("User not found with id of " + user_id)
    }

    const encrypted_pw = encrypt_password(new_password, this.secretKey)

    const updated_user = await this.prisma.user.update({
      where: { id: user_id },
      data: {
        password: encrypted_pw,
      }
    })

    return {
      success: true,
      msg: "Password changed successfully",
    }

  }

  async change_own_password(new_pw: string, current_pw: string): Promise<{ success: boolean, msg: string}> {

    const user_id = this.authUser.user.id 

    const user = await this.prisma.user.findUnique({
      where: { id: this.authUser.user.id }
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

    const updated_user = await this.prisma.user.update({
      where: { id: user_id },
      data: {
        password: encrypted_pw,
      }
    })

    return {
      success: true,
      msg: "Password changed successfully",
    }

  }


}
