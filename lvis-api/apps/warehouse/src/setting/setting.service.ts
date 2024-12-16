import { Injectable, NotFoundException } from '@nestjs/common';
import { SETTINGS } from '../__common__/constants';
import { PrismaService } from '../__prisma__/prisma.service';

@Injectable()
export class SettingService {

    constructor(private readonly prisma: PrismaService) { }

    async get_osriv_expiration() {


        const osriv_setting = await this.prisma.setting.findUnique({
            where: {
                key: SETTINGS.OSRIV_EXP_PERIOD_IN_DAYS
            }
        })

        const expirationValue = Number(osriv_setting.value);

        if (isNaN(expirationValue)) {
            throw new Error(`Invalid value for ${SETTINGS.OSRIV_EXP_PERIOD_IN_DAYS}. Expected a number.`);
        }

        return expirationValue

    }

    async get_seriv_expiration() {

        const seriv_setting = await this.prisma.setting.findUnique({
            where: {
                key: SETTINGS.SERIV_EXP_PERIOD_IN_DAYS
            }
        })

        const expirationValue = Number(seriv_setting.value);

        if (isNaN(expirationValue)) {
            throw new Error(`Invalid value for ${SETTINGS.SERIV_EXP_PERIOD_IN_DAYS}. Expected a number.`);
        }

        return expirationValue

    }

    async get_mrv_expiration() {

        const mrv_setting = await this.prisma.setting.findUnique({
            where: {
                key: SETTINGS.MRV_EXP_PERIOD_IN_DAYS
            }
        })

        const expirationValue = Number(mrv_setting.value);

        if (isNaN(expirationValue)) {
            throw new Error(`Invalid value for ${SETTINGS.MRV_EXP_PERIOD_IN_DAYS}. Expected a number.`);
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
