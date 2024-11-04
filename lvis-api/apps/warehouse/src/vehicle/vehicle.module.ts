import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleResolver } from './vehicle.resolver';
import { GasSlipService } from '../gas-slip/gas-slip.service';

@Module({
  providers: [VehicleResolver, VehicleService, GasSlipService],
})
export class VehicleModule {}
