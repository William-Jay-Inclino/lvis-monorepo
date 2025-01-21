import { Module } from '@nestjs/common';
import { CanvassItemService } from './canvass-item.service';
import { CanvassItemResolver } from './canvass-item.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
    imports: [WarehouseAuditModule],
    providers: [CanvassItemService, CanvassItemResolver, WinstonLoggerService]
})
export class CanvassItemModule {}
