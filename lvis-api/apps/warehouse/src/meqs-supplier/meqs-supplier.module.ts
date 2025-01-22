import { Module } from '@nestjs/common';
import { MeqsSupplierService } from './meqs-supplier.service';
import { MeqsSupplierResolver } from './meqs-supplier.resolver';
import { HttpModule } from '@nestjs/axios';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [MeqsSupplierResolver, MeqsSupplierService, WinstonLoggerService],
})
export class MeqsSupplierModule { }
