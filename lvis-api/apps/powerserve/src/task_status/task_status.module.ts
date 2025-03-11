import { Module } from '@nestjs/common';
import { TaskStatusService } from './task_status.service';
import { TaskStatusResolver } from './task_status.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [TaskStatusResolver, TaskStatusService],
})
export class TaskStatusModule {}
