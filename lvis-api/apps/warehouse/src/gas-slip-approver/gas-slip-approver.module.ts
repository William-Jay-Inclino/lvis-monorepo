import { Module } from '@nestjs/common';
import { GasSlipApproverService } from './gas-slip-approver.service';
import { GasSlipApproverResolver } from './gas-slip-approver.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [GasSlipApproverResolver, GasSlipApproverService, WinstonLoggerService],
})
export class GasSlipApproverModule {}
