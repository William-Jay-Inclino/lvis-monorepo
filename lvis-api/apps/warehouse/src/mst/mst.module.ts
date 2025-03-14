import { Module } from '@nestjs/common';
import { MstService } from './mst.service';
import { MstResolver } from './mst.resolver';
import { HttpModule } from '@nestjs/axios';
import { MstApproverService } from '../mst-approver/mst-approver.service';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';
import { MstPdfService } from './mst.pdf.service';
import { MstController } from './mst.controller';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [
    MstResolver, 
    MstService, 
    MstApproverService, 
    WinstonLoggerService,
    MstPdfService,
  ],
  controllers: [ MstController ]
})
export class MstModule {}
