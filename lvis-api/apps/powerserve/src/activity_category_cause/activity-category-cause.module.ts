import { Module } from '@nestjs/common';
import { ActivityCategoryCauseService } from './activity-category-cause.service';
import { ActivityCategoryCauseResolver } from './activity-category-cause.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [ActivityCategoryCauseResolver, ActivityCategoryCauseService],
})
export class ActivityCategoryCauseModule {}
