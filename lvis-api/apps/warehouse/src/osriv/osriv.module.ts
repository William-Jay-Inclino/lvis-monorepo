import { Module } from '@nestjs/common';
import { OsrivService } from './osriv.service';
import { OsrivResolver } from './osriv.resolver';
import { HttpModule } from '@nestjs/axios';
import { OsrivApproverService } from '../osriv-approver/osriv-approver.service';
import { CommonService } from '../__common__/classes';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';
import { OsrivController } from './osriv.controller';
import { OsrivReportService } from './osriv.report.service';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [
    OsrivResolver, 
    OsrivService, 
    OsrivApproverService, 
    CommonService, 
    WinstonLoggerService,
    OsrivReportService,
  ],
  controllers: [OsrivController]
})
export class OsrivModule {}
