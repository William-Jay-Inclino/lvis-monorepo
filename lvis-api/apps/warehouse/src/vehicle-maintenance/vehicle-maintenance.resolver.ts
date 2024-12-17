import { Resolver } from '@nestjs/graphql';
import { VehicleMaintenanceService } from './vehicle-maintenance.service';

@Resolver()
export class VehicleMaintenanceResolver {
  constructor(private readonly vehicleMaintenanceService: VehicleMaintenanceService) {}
}
