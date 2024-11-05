import { Module } from '@nestjs/common';
import { GasSlipService } from './gas-slip.service';
import { GasSlipResolver } from './gas-slip.resolver';
import { GasSlipApproverService } from '../gas-slip-approver/gas-slip-approver.service';
import { GasSlipPdfService } from './gas-slip.pdf.service';
import { HttpModule } from '@nestjs/axios';
import { GasSlipController } from './gas-slip.controller';

@Module({
  imports: [HttpModule],
  providers: [GasSlipResolver, GasSlipService, GasSlipApproverService, GasSlipPdfService],
  controllers: [GasSlipController],
})
export class GasSlipModule {}
