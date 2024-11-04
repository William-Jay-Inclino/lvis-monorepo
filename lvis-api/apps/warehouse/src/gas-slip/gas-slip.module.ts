import { Module } from '@nestjs/common';
import { GasSlipService } from './gas-slip.service';
import { GasSlipResolver } from './gas-slip.resolver';
import { GasSlipApproverService } from '../gas-slip-approver/gas-slip-approver.service';

@Module({
  providers: [GasSlipResolver, GasSlipService, GasSlipApproverService],
})
export class GasSlipModule {}
