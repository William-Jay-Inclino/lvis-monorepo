import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { AuthModule } from './__auth__/auth.module';
import { SeederModule } from './__seeder__/seeder.module';
import { PrismaModule } from './__prisma__/prisma.module';
import { CanvassModule } from './canvass/canvass.module';
import { CanvassItemModule } from './canvass-item/canvass-item.module';
import { EmployeeModule } from './__employee__/employee.module';
import { RvModule } from './rv/rv.module';
import { ClassificationModule } from './__classification__/classification.module';
import { HttpModule } from '@nestjs/axios';
import { RvApproverModule } from './rv-approver/rv-approver.module';
import { MeqsApproverModule } from './meqs-approver/meqs-approver.module';
import { MeqsSupplierModule } from './meqs-supplier/meqs-supplier.module';
import { MeqsSupplierItemModule } from './meqs-supplier-item/meqs-supplier-item.module';
import { MeqsSupplierAttachmentModule } from './meqs-supplier-attachment/meqs-supplier-attachment.module';
import { MeqsModule } from './meqs/meqs.module';
import { UnitModule } from './unit/unit.module';
import { SupplierModule } from './supplier/supplier.module';
import { PoModule } from './po/po.module';
import { PoApproverModule } from './po-approver/po-approver.module';
import { ItemModule } from './item/item.module';
import { RrModule } from './rr/rr.module';
import { RrApproverModule } from './rr-approver/rr-approver.module';
import { RrItemModule } from './rr-item/rr-item.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JoModule } from './jo/jo.module';
import { JoApproverModule } from './jo-approver/jo-approver.module';
import { SprModule } from './spr/spr.module';
import { SprApproverModule } from './spr-approver/spr-approver.module';
import { PendingModule } from './pending/pending.module';
import { OsrivModule } from './osriv/osriv.module';
import { OsrivApproverModule } from './osriv-approver/osriv-approver.module';
import { OsrivItemModule } from './osriv-item/osriv-item.module';
import { StationModule } from './station/station.module';
import { SerivModule } from './seriv/seriv.module';
import { SerivApproverModule } from './seriv-approver/seriv-approver.module';
import { SerivItemModule } from './seriv-item/seriv-item.module';
import { MrvModule } from './mrv/mrv.module';
import { MrvApproverModule } from './mrv-approver/mrv-approver.module';
import { MrvItemModule } from './mrv-item/mrv-item.module';
import { ProjectModule } from './project/project.module';
import { MctModule } from './mct/mct.module';
import { MctApproverModule } from './mct-approver/mct-approver.module';
import { McrtModule } from './mcrt/mcrt.module';
import { McrtApproverModule } from './mcrt-approver/mcrt-approver.module';
import { McrtItemModule } from './mcrt-item/mcrt-item.module';
import { MstModule } from './mst/mst.module';
import { MstApproverModule } from './mst-approver/mst-approver.module';
import { MstItemModule } from './mst-item/mst-item.module';
import { ItemTypeModule } from './item-type/item-type.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './__task-scheduler__/task.service';
import { VehicleModule } from './vehicle/vehicle.module';
import { FuelTypeModule } from './fuel-type/fuel-type.module';
import { GasSlipModule } from './gas-slip/gas-slip.module';
import { GasSlipApproverModule } from './gas-slip-approver/gas-slip-approver.module';
import { TripTicketModule } from './trip-ticket/trip-ticket.module';
import { TripTicketApproverModule } from './trip-ticket-approver/trip-ticket-approver.module';
import { GasStationModule } from './gas-station/gas-station.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { SettingModule } from './setting/setting.module';
import { ConfigModule } from '@nestjs/config';


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
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    PrometheusModule.register(),
    HttpModule,
    AuthModule,
    SeederModule,
    PrismaModule,
    PendingModule,
    EmployeeModule,
    ClassificationModule,
    UnitModule,
    SupplierModule,
    ItemModule,
    ItemTypeModule,



    // ============================= PURCHASING ============================= 
    CanvassModule,
    CanvassItemModule,
    RvModule,
    RvApproverModule,
    JoModule,
    JoApproverModule,
    SprModule,
    SprApproverModule,
    MeqsApproverModule,
    MeqsSupplierModule,
    MeqsSupplierItemModule,
    MeqsSupplierAttachmentModule,
    MeqsModule,
    PoModule,
    PoApproverModule,
    RrModule,
    RrApproverModule,
    RrItemModule,



    // ============================= WAREHOUSING ============================= 
    OsrivModule,
    OsrivApproverModule,
    OsrivItemModule,
    StationModule,
    SerivModule,
    SerivApproverModule,
    SerivItemModule,
    MrvModule,
    MrvApproverModule,
    MrvItemModule,
    ProjectModule,
    MctModule,
    MctApproverModule,
    McrtModule,
    McrtApproverModule,
    McrtItemModule,
    MstModule,
    MstApproverModule,
    MstItemModule,


    // ============================= MOTORPOOL ============================= 
    VehicleModule,
    FuelTypeModule,
    GasSlipModule,
    GasStationModule,
    GasSlipApproverModule,
    TripTicketModule,
    TripTicketApproverModule,
    SettingModule,
  ],
  controllers: [],
  providers: [
    TasksService,
  ],
})
export class WarehouseModule { }
