import { Module } from '@nestjs/common';
import { PendingService } from './pending.service';
import { PendingResolver } from './pending.resolver';
import { HttpModule } from '@nestjs/axios';
import { ItemService } from '../item/item.service';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { CommonService } from '../__common__/classes';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [PendingResolver, PendingService, ItemService, WinstonLoggerService, CommonService],
  exports: [PendingService],
})
export class PendingModule {}
