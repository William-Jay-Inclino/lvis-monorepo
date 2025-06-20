import { Module } from '@nestjs/common';
import { MctService } from './mct.service';
import { MctResolver } from './mct.resolver';
import { HttpModule } from '@nestjs/axios';
import { MctApproverService } from '../mct-approver/mct-approver.service';
import { MrvService } from '../mrv/mrv.service';
import { CommonService } from '../__common__/classes';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { MctController } from './mct.controller';
import { MctPdfService } from './mct.pdf.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';
import { MctReportService } from './mct.report.service';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [
    MctResolver, 
    MctService, 
    MctApproverService, 
    MrvService, 
    CommonService, 
    WinstonLoggerService,
    MctPdfService,
    MctReportService,
  ],
  controllers: [MctController]
})
export class MctModule {}
