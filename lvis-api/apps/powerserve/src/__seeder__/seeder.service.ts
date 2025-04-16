import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import * as data from './mock-data';

@Injectable()
export class SeederService {

    constructor(private readonly prisma: PrismaService) { }

    async seedData() {
        console.log('seeding warehouse database...');
        try {
            await this.prisma.$transaction([
                this.seedArea(), // d
                this.seedRemarks(), // d
                this.seedEquipment(), // d
                this.seedUnit(), // d
                this.seedLineman(), // d
                this.seedMunicipality(), //d
                this.seedBarangay(), // d
                this.seedFeeder(), // d
                this.seedWeatherCondition(), // d 
                this.seedDevice(), // d
                this.seedMeterBrand(), //d 
                this.seedComplaintStatus(), // d
                this.seedComplaintReportType(), //d 
                this.seedActivityCategory(), // d
                this.seedActivity(), // d
                this.seedActivityCategoryCauses(), // d
                this.seedTaskStatus(), // d
            ]

            );
        } catch (error) {
            console.error('Error in seeding tables', error);
        }
    }

    seedActivityCategory() {
        console.log('seeding activity_category table...');

        try {
            return this.prisma.activityCategory.createMany({ data: data.activity_categories })
        } catch (error) {
            console.error('Error in seeding activity_category table');
        }
    }

    seedLineman() {
        console.log('seeding lineman table...');

        try {
            return this.prisma.lineman.createMany({ data: data.linemen })
        } catch (error) {
            console.error('Error in seeding lineman table');
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

    seedRemarks() {
        console.log('seeding remarks table...');

        try {
            return this.prisma.remarks.createMany({ data: data.remarks })
        } catch (error) {
            console.error('Error in seeding remarks table');
        }
    }

    seedActivityCategoryCauses() {
        console.log('seeding activity_category_cause table...');

        try {
            return this.prisma.activityCategoryCause.createMany({ data: data.causes })
        } catch (error) {
            console.error('Error in seeding activity_category_cause table');
        }
    }

    seedEquipment() {
        console.log('seeding equipment table...');

        try {
            return this.prisma.equipment.createMany({ data: data.equipments })
        } catch (error) {
            console.error('Error in seeding equipment table');
        }
    }

    seedArea() {
        console.log('seeding area table...');

        try {
            return this.prisma.area.createMany({ data: data.areas })
        } catch (error) {
            console.error('Error in seeding area table');
        }
    }

    seedMunicipality() {
        console.log('seeding municipality table...');

        try {
            return this.prisma.municipality.createMany({ data: data.municipalities })
        } catch (error) {
            console.error('Error in seeding municipality table');
        }
    }

    seedBarangay() {
        console.log('seeding barangay table...');

        try {
            return this.prisma.barangay.createMany({ data: data.barangays })
        } catch (error) {
            console.error('Error in seeding barangay table');
        }
    }

    seedFeeder() {
        console.log('seeding feeder table...');

        try {
            return this.prisma.feeder.createMany({ data: data.feeders })
        } catch (error) {
            console.error('Error in seeding feeder table');
        }
    }

    seedWeatherCondition() {
        console.log('seeding weather_condition table...');

        try {
            return this.prisma.weatherCondition.createMany({ data: data.weather_conditions })
        } catch (error) {
            console.error('Error in seeding weather_condition table');
        }
    }

    seedDevice() {
        console.log('seeding device table...');

        try {
            return this.prisma.device.createMany({ data: data.devices })
        } catch (error) {
            console.error('Error in seeding device table');
        }
    }

    seedMeterBrand() {
        console.log('seeding meter_brand table...');

        try {
            return this.prisma.meterBrand.createMany({ data: data.meter_brands })
        } catch (error) {
            console.error('Error in seeding meter_brand table');
        }
    }

    seedComplaintStatus() {
        console.log('seeding complaint_status table...');

        try {
            return this.prisma.complaintStatus.createMany({ data: data.complaint_statuses })
        } catch (error) {
            console.error('Error in seeding complaint_status table');
        }
    }

    seedComplaintReportType() {
        console.log('seeding complaint_report_type table...');

        try {
            return this.prisma.complaintReportType.createMany({ data: data.complaint_report_types })
        } catch (error) {
            console.error('Error in seeding complaint_report_type table');
        }
    }

    seedActivity() {
        console.log('seeding activity table...');

        try {
            return this.prisma.activity.createMany({ data: data.activities })
        } catch (error) {
            console.error('Error in seeding activity table');
        }
    }

    seedTaskStatus() {
        console.log('seeding task_status table...');

        try {
            return this.prisma.taskStatus.createMany({ data: data.task_statuses })
        } catch (error) {
            console.error('Error in seeding task_status table');
        }
    }

}
