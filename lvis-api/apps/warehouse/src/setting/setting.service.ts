import { Injectable, NotFoundException } from '@nestjs/common';
import { SETTINGS } from '../__common__/constants';
import { PrismaService } from '../__prisma__/prisma.service';

@Injectable()
export class SettingService {

    constructor(private readonly prisma: PrismaService) { }

    async get_default_exp_days(key: SETTINGS): Promise<number> {

        const item = await this.prisma.setting.findUnique({
            where: { key }
        })

        if(!item) {
            throw new NotFoundException(`Key: ${key} not found in warehouse:setting table`)
        }

        const expirationValue = Number(item.value);

        if (isNaN(expirationValue)) {
            throw new Error(`Invalid value for ${key}. Expected a number.`);
        }

        return expirationValue
    }

    async get_min_or_max_supplier_in_meqs(key: SETTINGS) {
        const item = await this.prisma.setting.findUnique({
            where: {
                key
            }
        })

        if(!item) {
            throw new NotFoundException(`key: ${key} in setting table not found`)
        }

        return Number(item.value)

    }


}
