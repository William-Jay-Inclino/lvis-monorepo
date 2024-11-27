import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import * as data from './mock-data';
import { SETTINGS } from '../__common__/constants';

@Injectable()
export class SeederService {

    constructor(private readonly prisma: PrismaService) { }

    async seedData() {

        try {
            await this.prisma.$transaction([
                this.seedSupplier(),
                this.seedStation(),
                this.seedProject(),
                this.seedItemType(),
                this.seedGasStations(),
                this.seedFuelTypes(),
                this.seedItemCodeTracker(),
                this.seedUnit(),
                // this.seedVehicle(),
                this.seedSettingTable(),
            ]

            );
        } catch (error) {
        }
    }

    seedSupplier() {
        try {
            return this.prisma.supplier.createMany({ data: data.suppliers })
        } catch (error) {
        }
    }

    seedStation() {
        try {
            return this.prisma.station.createMany({ data: data.stations })
        } catch (error) {
        }
    }

    seedProject() {
        try {
            return this.prisma.project.createMany({ data: data.projects })
        } catch (error) {
        }
    }

    seedUnit() {
        try {
            return this.prisma.unit.createMany({ data: data.units })
        } catch (error) {
        }
    }

    seedItemType() {
        try {
            return this.prisma.itemType.createMany({ data: data.itemTypes })
        } catch (error) {
        }
    }

    seedGasStations() {
        try {
            return this.prisma.gasStation.createMany({ data: data.gasStations })
        } catch (error) {
        }
    }

    seedFuelTypes() {
        try {
            return this.prisma.fuelType.createMany({ data: data.fuelTypes })
        } catch (error) {
        }
    }

    seedItemCodeTracker() {
        try {
            return this.prisma.itemCodeTracker.createMany({ data: data.itemCodeTracker })
        } catch (error) {
        }
    }

    seedSettingTable() {
    
        try {
            return this.prisma.setting.createMany({
                data: [
                    {
                        key: SETTINGS.OSRIV_EXP_PERIOD_IN_DAYS,
                        value: '7',
                    },
                    {
                        key: SETTINGS.SERIV_EXP_PERIOD_IN_DAYS,
                        value: '7',
                    },
                    {
                        key: SETTINGS.MRV_EXP_PERIOD_IN_DAYS,
                        value: '7',
                    },
                    {
                        key: SETTINGS.DEFAULT_STATION,
                        value: data.main_office_id,
                    }
                ]
            });
        } catch (error) {
        }
    }

}
