import { Module } from '@nestjs/common';
import { BarangayService } from './barangay.service';
import { BarangayResolver } from './barangay.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [BarangayResolver, BarangayService],
})
export class BarangayModule {}
