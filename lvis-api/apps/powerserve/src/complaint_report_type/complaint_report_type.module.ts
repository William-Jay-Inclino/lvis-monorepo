import { Module } from '@nestjs/common';
import { ComplaintReportTypeService } from './complaint_report_type.service';
import { ComplaintReportTypeResolver } from './complaint_report_type.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [ComplaintReportTypeResolver, ComplaintReportTypeService],
})
export class ComplaintReportTypeModule {}
