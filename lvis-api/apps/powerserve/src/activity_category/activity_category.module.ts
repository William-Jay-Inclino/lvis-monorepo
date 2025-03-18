import { Module } from '@nestjs/common';
import { ActivityCategoryResolver } from './activity_category.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';
import { ActivityCategoryService } from './activity_category.service';

@Module({
  imports: [PowerserveAuditModule],
  providers: [ActivityCategoryResolver, ActivityCategoryService],
})
export class ActivityCategoryModule {}
