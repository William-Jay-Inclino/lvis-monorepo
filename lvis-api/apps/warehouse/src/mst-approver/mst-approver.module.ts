import { Module } from '@nestjs/common';
import { MstApproverService } from './mst-approver.service';
import { MstApproverResolver } from './mst-approver.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [WarehouseAuditModule],
  providers: [MstApproverResolver, MstApproverService, WinstonLoggerService],
})
export class MstApproverModule {}
