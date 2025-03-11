import { Module } from '@nestjs/common';
import { MeterBrandService } from './meter_brand.service';
import { MeterBrandResolver } from './meter_brand.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [MeterBrandResolver, MeterBrandService],
})
export class MeterBrandModule {}
