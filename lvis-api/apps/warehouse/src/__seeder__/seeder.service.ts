import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import * as data from './mock-data';
import { SETTINGS } from '../__common__/constants';

@Injectable()
export class SeederService {

    constructor(private readonly prisma: PrismaService) { }

    async seedData() {
        console.log('seeding warehouse database...');
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
        console.log('seeding supplier table...');

        try {
            return this.prisma.supplier.createMany({ data: data.suppliers })
        } catch (error) {
        }
    }

    seedStation() {
        console.log('seeding station table...');
        try {
            return this.prisma.station.createMany({ data: data.stations })
        } catch (error) {
        }
    }

    seedProject() {
        console.log('seeding project table...');
        try {
            return this.prisma.project.createMany({ data: data.projects })
        } catch (error) {
        }
    }

    seedUnit() {
        console.log('seeding unit table...');
        try {
            return this.prisma.unit.createMany({ data: data.units })
        } catch (error) {
        }
    }

    seedItemType() {
        console.log('seeding item_type table...');
        try {
            return this.prisma.itemType.createMany({ data: data.itemTypes })
        } catch (error) {
        }
    }

    seedGasStations() {
        console.log('seeding gas_station table...');
        try {
            return this.prisma.gasStation.createMany({ data: data.gasStations })
        } catch (error) {
        }
    }

    seedFuelTypes() {
        console.log('seeding fuel_type table...');
        try {
            return this.prisma.fuelType.createMany({ data: data.fuelTypes })
        } catch (error) {
        }
    }

    seedItemCodeTracker() {
        console.log('seeding item_code_tracker table...');
        try {
            return this.prisma.itemCodeTracker.createMany({ data: data.itemCodeTracker })
        } catch (error) {
        }
    }

    seedSettingTable() {
        console.log('seeding setting table...');
    
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
