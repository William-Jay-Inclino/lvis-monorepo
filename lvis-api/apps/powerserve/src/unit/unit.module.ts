import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitResolver } from './unit.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [UnitResolver, UnitService],
})
export class UnitModule {}
