import { Module } from '@nestjs/common';
import { GasStationService } from './gas-station.service';
import { GasStationResolver } from './gas-station.resolver';

@Module({
  providers: [GasStationResolver, GasStationService],
})
export class GasStationModule {}
