import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';
import { HttpModule } from '@nestjs/axios';
import { ItemController } from './item.controller';
import { ItemReportService } from './item.report.service';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [
    ItemResolver, 
    ItemService, 
    WinstonLoggerService, 
    ItemReportService,
  ],
  controllers: [ ItemController ]
})
export class ItemModule {}
