import { Module } from '@nestjs/common';
import { FeederService } from './feeder.service';
import { FeederResolver } from './feeder.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [FeederResolver, FeederService],
})
export class FeederModule {}
