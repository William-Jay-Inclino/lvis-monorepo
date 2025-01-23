import { Module } from '@nestjs/common';
import { MrvApproverService } from './mrv-approver.service';
import { MrvApproverResolver } from './mrv-approver.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [WarehouseAuditModule],
  providers: [MrvApproverResolver, MrvApproverService, WinstonLoggerService],
})
export class MrvApproverModule {}
