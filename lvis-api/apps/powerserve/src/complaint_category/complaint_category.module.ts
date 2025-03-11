import { Module } from '@nestjs/common';
import { ComplaintCategoryService } from './complaint_category.service';
import { ComplaintCategoryResolver } from './complaint_category.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [ComplaintCategoryResolver, ComplaintCategoryService],
})
export class ComplaintCategoryModule {}
