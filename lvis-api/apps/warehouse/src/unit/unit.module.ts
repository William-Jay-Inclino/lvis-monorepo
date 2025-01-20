import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitResolver } from './unit.resolver';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [WarehouseAuditModule],
  providers: [UnitResolver, UnitService],
})
export class UnitModule {}
