import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDepartmentInput } from './dto/create-department.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, Department } from 'apps/system/prisma/generated/client';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { SystemRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';
import { divisions } from '../__seeder__/mock-data';

@Injectable()
export class DepartmentService {

  private readonly logger = new Logger(DepartmentService.name);
  private authUser: AuthUser

  constructor(private readonly prisma: PrismaService) { }

  setAuthUser(authUser: AuthUser) {
    this.authUser = authUser
  }

  async create(input: CreateDepartmentInput): Promise<Department> {

    const data: Prisma.DepartmentCreateInput = {
      code: input.code,
      name: input.name,
    }

    if (input.permissions) {
      data.permissions = JSON.parse(input.permissions)
    }

    const created = await this.prisma.department.create({
      data
    })

    if(created.permissions) {
			created.permissions = JSON.stringify(created.permissions)
		}

    return created

  }

  async findAll(): Promise<Department[]> {
    const items = await this.prisma.department.findMany({
      include: {
        divisions: true
      }
    })

    return items.map(i => {
			i.permissions = !!i.permissions ? JSON.stringify(i.permissions) : null
			return i
		})

  }

  async findOne(id: string): Promise<Department | null> {

    const item = await this.prisma.department.findUnique({
      where: { id }
    })

    if (!item) {
      throw new NotFoundException('Department not found')
    }

    if(item.permissions) {
			item.permissions = JSON.stringify(item.permissions)
		}

    return item
  }

  async update(id: string, input: UpdateDepartmentInput): Promise<Department> {

    const existingItem = await this.findOne(id)

    const data: Prisma.DepartmentUpdateInput = {
      code: input.code ?? existingItem.code,
      name: input.name ?? existingItem.name,
    }

    if (input.permissions) {
			data.permissions = JSON.parse(input.permissions)
		}

    const updated = await this.prisma.department.update({
      data,
      where: {
        id
      }
    })

    if(updated.permissions) {
			updated.permissions = JSON.stringify(updated.permissions)
		}

    return updated

  }

  async remove(id: string): Promise<SystemRemoveResponse> {

    const existingItem = await this.findOne(id)

    await this.prisma.department.delete({
      where: { id }
    })

    return {
      success: true,
      msg: "Department successfully deleted"
    }

  }

}
