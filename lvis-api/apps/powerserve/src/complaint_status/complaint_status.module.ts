import { Module } from '@nestjs/common';
import { ComplaintStatusService } from './complaint_status.service';
import { ComplaintStatusResolver } from './complaint_status.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [ComplaintStatusResolver, ComplaintStatusService],
})
export class ComplaintStatusModule {}
