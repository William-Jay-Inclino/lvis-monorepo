import { Module } from '@nestjs/common';
import { SitioService } from './sitio.service';
import { SitioResolver } from './sitio.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [SitioResolver, SitioService],
})
export class SitioModule {}
