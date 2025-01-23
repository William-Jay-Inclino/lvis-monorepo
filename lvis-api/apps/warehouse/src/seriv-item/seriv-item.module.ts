import { Module } from '@nestjs/common';
import { SerivItemService } from './seriv-item.service';
import { SerivItemResolver } from './seriv-item.resolver';
import { CommonService } from '../__common__/classes';
import { HttpModule } from '@nestjs/axios';
import { McrtService } from '../mcrt/mcrt.service';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [
    SerivItemResolver, 
    SerivItemService,
    McrtService,
    CommonService, 
    WinstonLoggerService
  ],
})
export class SerivItemModule {}
