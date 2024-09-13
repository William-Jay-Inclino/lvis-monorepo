import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { SETTINGS } from '../__common__/constants';

@Injectable()
export class SettingService {

    constructor(private readonly prisma: PrismaService) { }
    
    async findGM() {

        console.log('findGM()');
        
        const item = await this.prisma.setting.findUnique({
        where: {
            key: SETTINGS.GENERAL_MANAGER
        }
        })

        if(!item) {
            throw new NotFoundException(`key ${SETTINGS.GENERAL_MANAGER} in setting table not found`)
        }

        const employee = await this.prisma.employee.findUnique({
            where: { id: item.value },
            include: {
                position: true,
                department: true,
            }
        })

        if(!employee) {
            throw new NotFoundException('Employee not found with id of ' + item.value)
        }

        return employee

    }
    async findWarehouseCustodian() {

        console.log('findWarehouseCustodian()');
        
        const item = await this.prisma.setting.findUnique({
        where: {
            key: SETTINGS.WAREHOUSE_CUSTODIAN
        }
        })

        if(!item) {
            throw new NotFoundException(`key ${SETTINGS.WAREHOUSE_CUSTODIAN} in setting table not found`)
        }

        const employee = await this.prisma.employee.findUnique({
            where: { id: item.value },
            include: {
                position: true,
                department: true,
            }
        })

        if(!employee) {
            throw new NotFoundException('Employee not found with id of ' + item.value)
        }

        return employee

    }
}
