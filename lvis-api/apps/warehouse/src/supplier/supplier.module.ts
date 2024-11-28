import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierResolver } from './supplier.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [SupplierResolver, SupplierService, WinstonLoggerService],
})
export class SupplierModule {}
