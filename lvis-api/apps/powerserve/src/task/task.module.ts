import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';
import { ComplaintModule } from '../complaint/complaint.module';

@Module({
  imports: [ PowerserveAuditModule, ComplaintModule],
  providers: [TaskResolver, TaskService],
})
export class TaskModule {}
