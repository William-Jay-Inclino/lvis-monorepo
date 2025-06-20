import { Module } from '@nestjs/common';
import { SerivService } from './seriv.service';
import { SerivResolver } from './seriv.resolver';
import { HttpModule } from '@nestjs/axios';
import { SerivApproverService } from '../seriv-approver/seriv-approver.service';
import { CommonService } from '../__common__/classes';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { SerivController } from './seriv.controller';
import { SerivPdfService } from './seriv.pdf.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';
import { SerivReportService } from './seriv.report.service';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [
    SerivResolver, 
    SerivService, 
    SerivApproverService, 
    CommonService, 
    WinstonLoggerService,
    SerivPdfService,
    SerivReportService,
  ],
  controllers: [SerivController]
})
export class SerivModule {}
