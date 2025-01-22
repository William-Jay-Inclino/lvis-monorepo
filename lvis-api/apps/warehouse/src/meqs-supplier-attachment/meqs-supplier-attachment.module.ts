import { Module } from '@nestjs/common';
import { MeqsSupplierAttachmentService } from './meqs-supplier-attachment.service';
import { MeqsSupplierAttachmentResolver } from './meqs-supplier-attachment.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [WarehouseAuditModule],
  providers: [MeqsSupplierAttachmentResolver, MeqsSupplierAttachmentService, WinstonLoggerService, WinstonLoggerService],
})
export class MeqsSupplierAttachmentModule {}
