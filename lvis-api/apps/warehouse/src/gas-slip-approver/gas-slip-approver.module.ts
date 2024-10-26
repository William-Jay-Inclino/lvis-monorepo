import { Module } from '@nestjs/common';
import { GasSlipApproverService } from './gas-slip-approver.service';
import { GasSlipApproverResolver } from './gas-slip-approver.resolver';

@Module({
  providers: [GasSlipApproverResolver, GasSlipApproverService],
})
export class GasSlipApproverModule {}
