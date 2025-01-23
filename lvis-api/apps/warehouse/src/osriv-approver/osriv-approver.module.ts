import { Module } from '@nestjs/common';
import { OsrivApproverService } from './osriv-approver.service';
import { OsrivApproverResolver } from './osriv-approver.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [WarehouseAuditModule],
  providers: [
    OsrivApproverResolver, 
    OsrivApproverService, 
    WinstonLoggerService],
})
export class OsrivApproverModule {}
