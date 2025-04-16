import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentResolver } from './equipment.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [EquipmentResolver, EquipmentService],
})
export class EquipmentModule {}
