import { Module } from '@nestjs/common';
import { MeqsSupplierAttachmentService } from './meqs-supplier-attachment.service';
import { MeqsSupplierAttachmentResolver } from './meqs-supplier-attachment.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [MeqsSupplierAttachmentResolver, MeqsSupplierAttachmentService, WinstonLoggerService, WinstonLoggerService],
})
export class MeqsSupplierAttachmentModule {}
