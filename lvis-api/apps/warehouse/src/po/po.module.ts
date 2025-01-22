import { Module } from '@nestjs/common';
import { PoResolver } from './po.resolver';
import { PoService } from './po.service';
import { HttpModule } from '@nestjs/axios';
import { PoApproverService } from '../po-approver/po-approver.service';
import { PoController } from './po.controller';
import { PoPdfService } from './po.pdf.service';
import { MeqsService } from '../meqs/meqs.service';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [
    PoResolver, 
    PoService, 
    PoPdfService, 
    PoApproverService,
    MeqsService, 
    WinstonLoggerService
  ],
  exports: [PoService],
  controllers: [PoController]
})
export class PoModule {}
