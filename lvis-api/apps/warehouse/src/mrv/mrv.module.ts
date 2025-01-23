import { Module } from '@nestjs/common';
import { MrvService } from './mrv.service';
import { MrvResolver } from './mrv.resolver';
import { HttpModule } from '@nestjs/axios';
import { MrvApproverService } from '../mrv-approver/mrv-approver.service';
import { CommonService } from '../__common__/classes';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { MrvController } from './mrv.controller';
import { MrvPdfService } from './mrv.pdf.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [
    MrvResolver, 
    MrvService, 
    MrvApproverService, 
    CommonService, 
    WinstonLoggerService,
    MrvPdfService,
  ],
  controllers: [MrvController]
})
export class MrvModule {}
