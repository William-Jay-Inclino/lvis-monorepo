import { Module } from '@nestjs/common';
import { PowerserveController } from './powerserve.controller';
import { PowerserveService } from './powerserve.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { SeederModule } from './__seeder__/seeder.module';
import { PrismaModule } from './__prisma__/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { AreaModule } from './area/area.module';
import { PowerserveAuditModule } from './powerserve_audit/powerserve_audit.module';
import { AuthModule } from './__auth__/auth.module';
import { LinemanModule } from './lineman/lineman.module';
import { MunicipalityModule } from './municipality/municipality.module';
import { BarangayModule } from './barangay/barangay.module';
import { SitioModule } from './sitio/sitio.module';
import { FeederModule } from './feeder/feeder.module';
import { WeatherConditionModule } from './weather_condition/weather_condition.module';
import { DeviceModule } from './device/device.module';
import { MeterBrandModule } from './meter_brand/meter_brand.module';
import { ComplaintStatusModule } from './complaint_status/complaint_status.module';
import { ComplaintReportTypeModule } from './complaint_report_type/complaint_report_type.module';
import { ComplaintCategoryModule } from './complaint_category/complaint_category.module';
import { NatureOfComplaintModule } from './nature_of_complaint/nature_of_complaint.module';
import { TaskStatusModule } from './task_status/task_status.module';
import { ComplaintModule } from './complaint/complaint.module';
import { ComplaintDetailModule } from './complaint_detail/complaint_detail.module';
import { ComplaintLogModule } from './complaint_log/complaint_log.module';
import { TaskModule } from './task/task.module';
import { TaskLogModule } from './task_log/task_log.module';
import { TaskFileModule } from './task_file/task_file.module';
import { TaskDetailPowerInterruptionModule } from './task_detail_power_interruption/task_detail_power_interruption.module';
import { TaskDetailKwhMeterModule } from './task_detail_kwh_meter/task_detail_kwh_meter.module';
import { TaskDetailLineServicesModule } from './task_detail_line_services/task_detail_line_services.module';
import { TaskDetailDlesModule } from './task_detail_dles/task_detail_dles.module';
import { TaskDetailLmdgaModule } from './task_detail_lmdga/task_detail_lmdga.module';
import { ComplaintAssignmentModule } from './complaint_assignment/complaint_assignment.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ============================= SHARED ============================= 

    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    PrometheusModule.register(),
    HttpModule,
    AuthModule,
    SeederModule,
    PrismaModule,
    AreaModule,
    PowerserveAuditModule,
    LinemanModule,
    MunicipalityModule,
    BarangayModule,
    SitioModule,
    FeederModule,
    WeatherConditionModule,
    DeviceModule,
    MeterBrandModule,
    ComplaintStatusModule,
    ComplaintReportTypeModule,
    ComplaintCategoryModule,
    NatureOfComplaintModule,
    TaskStatusModule,
    ComplaintModule,
    ComplaintDetailModule,
    ComplaintLogModule,
    TaskModule,
    TaskLogModule,
    TaskFileModule,
    TaskDetailPowerInterruptionModule,
    TaskDetailKwhMeterModule,
    TaskDetailLineServicesModule,
    TaskDetailDlesModule,
    TaskDetailLmdgaModule,
    ComplaintAssignmentModule,

  ],
  controllers: [PowerserveController],
  providers: [PowerserveService],
})
export class PowerserveModule {}
