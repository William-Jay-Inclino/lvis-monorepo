import { Module } from '@nestjs/common';
import { WarehouseAuditService } from './warehouse_audit.service';

@Module({
    providers: [
        WarehouseAuditService,
    ],
    exports: [WarehouseAuditService],
})
export class WarehouseAuditModule {}
