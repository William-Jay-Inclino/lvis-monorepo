import { Module } from '@nestjs/common';
import { VehicleMaintenanceService } from './vehicle-maintenance.service';
import { VehicleMaintenanceResolver } from './vehicle-maintenance.resolver';

@Module({
  providers: [VehicleMaintenanceResolver, VehicleMaintenanceService],
})
export class VehicleMaintenanceModule {}
