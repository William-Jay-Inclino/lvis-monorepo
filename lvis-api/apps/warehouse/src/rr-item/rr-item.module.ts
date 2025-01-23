import { Module } from '@nestjs/common';
import { RrItemService } from './rr-item.service';
import { RrItemResolver } from './rr-item.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [WarehouseAuditModule],
  providers: [RrItemResolver, RrItemService, WinstonLoggerService],
})
export class RrItemModule {}
