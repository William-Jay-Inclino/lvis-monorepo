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
                this.seedVehicleService(),
                this.seedServiceCenter(),
                this.seedSettingTable(),
            ]

            );
        } catch (error) {
            console.error('Error in seeding tables');
        }
    }

    seedSupplier() {
        console.log('seeding supplier table...');

        try {
            return this.prisma.supplier.createMany({ data: data.suppliers })
        } catch (error) {
            console.error('Error in seeding supplier table');
        }
    }

    seedStation() {
        console.log('seeding station table...');
        try {
            return this.prisma.station.createMany({ data: data.stations })
        } catch (error) {
            console.error('Error in seeding station table');
        }
    }

    seedProject() {
        console.log('seeding project table...');
        try {
            return this.prisma.project.createMany({ data: data.projects })
        } catch (error) {
            console.error('Error in seeding project table');
        }
    }

    seedUnit() {
        console.log('seeding unit table...');
        try {
            return this.prisma.unit.createMany({ data: data.units })
        } catch (error) {
            console.error('Error in seeding unit table');
        }
    }

    seedItemType() {
        console.log('seeding item_type table...');
        try {
            return this.prisma.itemType.createMany({ data: data.itemTypes })
        } catch (error) {
            console.error('Error in seeding item type table');
        }
    }

    seedGasStations() {
        console.log('seeding gas_station table...');
        try {
            return this.prisma.gasStation.createMany({ data: data.gasStations })
        } catch (error) {
            console.error('Error in seeding gas station table');
        }
    }

    seedFuelTypes() {
        console.log('seeding fuel_type table...');
        try {
            return this.prisma.fuelType.createMany({ data: data.fuelTypes })
        } catch (error) {
            console.error('Error in seeding fuel type table');
        }
    }

    seedItemCodeTracker() {
        console.log('seeding item_code_tracker table...');
        try {
            return this.prisma.itemCodeTracker.createMany({ data: data.itemCodeTracker })
        } catch (error) {
            console.error('Error in seeding item code tracker table');
        }
    }

    seedVehicleService() {
        console.log('seeding vehicle_service table...');
        try {
            return this.prisma.vehicleService.createMany({ data: data.services })
        } catch (error) {
            console.error('Error in seeding vehicle table');
        }
    }

    seedServiceCenter() {
        console.log('seeding service_center table...');
        try {
            return this.prisma.serviceCenter.createMany({ data: data.serviceCenters })
        } catch (error) {
            console.error('Error in seeding service center table');
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
                        value: '15',
                    },
                    {
                        key: SETTINGS.DEFAULT_STATION,
                        value: data.main_office_id,
                    },
                    {
                        key: SETTINGS.MIN_SUPPLIER_IN_MEQS,
                        value: "3",
                    },
                    {
                        key: SETTINGS.MAX_SUPPLIER_IN_MEQS,
                        value: "5",
                    }
                ]
            });
        } catch (error) {
            console.error('Error in seeding setting table');
        }
    }

}
