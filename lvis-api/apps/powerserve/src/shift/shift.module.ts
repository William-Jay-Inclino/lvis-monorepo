import { Module } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { ShiftResolver } from './shift.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [ShiftResolver, ShiftService],
})
export class ShiftModule {}
