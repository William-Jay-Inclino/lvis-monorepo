import { Module } from '@nestjs/common';
import { GasSlipService } from './gas-slip.service';
import { GasSlipResolver } from './gas-slip.resolver';
import { GasSlipApproverService } from '../gas-slip-approver/gas-slip-approver.service';
import { GasSlipPdfService } from './gas-slip.pdf.service';
import { HttpModule } from '@nestjs/axios';
import { GasSlipController } from './gas-slip.controller';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [GasSlipResolver, GasSlipService, GasSlipApproverService, GasSlipPdfService, WinstonLoggerService],
  controllers: [GasSlipController],
})
export class GasSlipModule {}
