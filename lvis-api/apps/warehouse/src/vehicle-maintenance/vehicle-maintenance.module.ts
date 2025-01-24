import { Module } from '@nestjs/common';
import { VehicleMaintenanceService } from './vehicle-maintenance.service';
import { VehicleMaintenanceResolver } from './vehicle-maintenance.resolver';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [WarehouseAuditModule],
  providers: [VehicleMaintenanceResolver, VehicleMaintenanceService],
})
export class VehicleMaintenanceModule {}
