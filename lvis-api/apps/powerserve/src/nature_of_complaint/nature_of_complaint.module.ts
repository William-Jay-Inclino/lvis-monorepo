import { Module } from '@nestjs/common';
import { NatureOfComplaintService } from './nature_of_complaint.service';
import { NatureOfComplaintResolver } from './nature_of_complaint.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [NatureOfComplaintResolver, NatureOfComplaintService],
})
export class NatureOfComplaintModule {}
