import { Module } from '@nestjs/common';
import { McrtApproverService } from './mcrt-approver.service';
import { McrtApproverResolver } from './mcrt-approver.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [WarehouseAuditModule],
  providers: [McrtApproverResolver, McrtApproverService, WinstonLoggerService],
})
export class McrtApproverModule {}
