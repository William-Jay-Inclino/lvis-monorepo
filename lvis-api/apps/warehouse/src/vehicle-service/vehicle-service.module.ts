import { Module } from '@nestjs/common';
import { VehicleServiceService } from './vehicle-service.service';
import { VehicleServiceResolver } from './vehicle-service.resolver';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [WarehouseAuditModule],
  providers: [VehicleServiceResolver, VehicleServiceService],
})
export class VehicleServiceModule {}
