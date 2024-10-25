import { Module } from '@nestjs/common';
import { GasSlipService } from './gas-slip.service';
import { GasSlipResolver } from './gas-slip.resolver';

@Module({
  providers: [GasSlipResolver, GasSlipService],
})
export class GasSlipModule {}
