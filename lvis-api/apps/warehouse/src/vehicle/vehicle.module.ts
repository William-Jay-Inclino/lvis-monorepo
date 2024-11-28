import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleResolver } from './vehicle.resolver';
import { GasSlipService } from '../gas-slip/gas-slip.service';
import { HttpModule } from '@nestjs/axios';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  imports: [HttpModule],
  providers: [VehicleResolver, VehicleService, GasSlipService, WinstonLoggerService],
})
export class VehicleModule {}
