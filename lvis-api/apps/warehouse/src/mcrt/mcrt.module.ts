import { Module } from '@nestjs/common';
import { McrtService } from './mcrt.service';
import { McrtResolver } from './mcrt.resolver';
import { McrtApproverService } from '../mcrt-approver/mcrt-approver.service';
import { HttpModule } from '@nestjs/axios';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';
import { McrtPdfService } from './mcrt.pdf.service';
import { McrtController } from './mcrt.controller';
import { McrtReportService } from './mcrt.report.service';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [
    McrtResolver, 
    McrtService, 
    McrtApproverService, 
    WinstonLoggerService,
    McrtPdfService,
    McrtReportService,
  ],
  controllers: [ McrtController ]
})
export class McrtModule {}
