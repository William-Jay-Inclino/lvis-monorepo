import { Module } from '@nestjs/common';
import { MeqsSupplierItemService } from './meqs-supplier-item.service';
import { MeqsSupplierItemResolver } from './meqs-supplier-item.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [MeqsSupplierItemResolver, MeqsSupplierItemService, WinstonLoggerService],
})
export class MeqsSupplierItemModule {}
