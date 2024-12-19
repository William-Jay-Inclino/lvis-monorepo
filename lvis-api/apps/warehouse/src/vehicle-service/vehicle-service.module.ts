import { Module } from '@nestjs/common';
import { VehicleServiceService } from './vehicle-service.service';
import { VehicleServiceResolver } from './vehicle-service.resolver';

@Module({
  providers: [VehicleServiceResolver, VehicleServiceService],
})
export class VehicleServiceModule {}
