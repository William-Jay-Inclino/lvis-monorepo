import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { SETTINGS } from '../__common__/constants';
import { Employee } from '../employee/entities/employee.entity';

@Injectable()
export class SettingService {

    constructor(private readonly prisma: PrismaService) { }

    async find_employee_in_settings(key: SETTINGS){

        const item = await this.prisma.setting.findUnique({
            where: {
                key
            }
        })

        if(!item) {
            throw new NotFoundException(`key: ${key} in setting table not found`)
        }

        const employee = await this.prisma.employee.findUnique({
            where: { id: item.value },
            include: {
                division: true,
                department: true,
            }
        })

        if(!employee) {
            throw new NotFoundException('Employee not found with id of ' + item.value)
        }

        return employee

    }

}
