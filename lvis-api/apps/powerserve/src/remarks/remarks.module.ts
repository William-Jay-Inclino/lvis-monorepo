import { Module } from '@nestjs/common';
import { RemarksService } from './remarks.service';
import { RemarksResolver } from './remarks.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [RemarksResolver, RemarksService],
})
export class RemarksModule {}
