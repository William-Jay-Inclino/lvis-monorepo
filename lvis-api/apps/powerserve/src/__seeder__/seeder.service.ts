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
                this.seedArea(),
                this.seedLineman(),
                this.seedMunicipality(),
                this.seedBarangay(),
                this.seedFeeder(),
                this.seedWeatherCondition(),
                this.seedDevice(),
                this.seedMeterBrand(),
                this.seedComplaintStatus(),
                this.seedComplaintReportType(),
                this.seedComplaintCategory(),
                this.seedNatureOfComplaint(),
                this.seedTaskStatus(),
            ]

            );
        } catch (error) {
            console.error('Error in seeding tables', error);
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

    seedComplaintCategory() {
        console.log('seeding complaint_category table...');

        try {
            return this.prisma.complaintCategory.createMany({ data: data.complaint_categories })
        } catch (error) {
            console.error('Error in seeding complaint_category table');
        }
    }

    seedNatureOfComplaint() {
        console.log('seeding nature_of_complaint table...');

        try {
            return this.prisma.natureOfComplaint.createMany({ data: data.nature_of_complaints })
        } catch (error) {
            console.error('Error in seeding nature_of_complaint table');
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
