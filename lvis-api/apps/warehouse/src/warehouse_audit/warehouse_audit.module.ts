import { Module } from '@nestjs/common';
import { WarehouseAuditService } from './warehouse_audit.service';
import { WarehouseAuditResolver } from './warehouse_audit.resolver';

@Module({
    providers: [
        WarehouseAuditService,
        WarehouseAuditResolver
    ],
    exports: [WarehouseAuditService],
})
export class WarehouseAuditModule {}
