import { Module } from '@nestjs/common';
import { MunicipalityService } from './municipality.service';
import { MunicipalityResolver } from './municipality.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [MunicipalityResolver, MunicipalityService],
})
export class MunicipalityModule {}
