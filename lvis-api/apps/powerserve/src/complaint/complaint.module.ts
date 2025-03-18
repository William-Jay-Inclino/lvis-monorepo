import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintResolver } from './complaint.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';
import { TaskModule } from '../task/task.module';
import { TaskService } from '../task/task.service';
import { AreaService } from '../area/area.service';

@Module({
  imports: [PowerserveAuditModule],
  providers: [ComplaintResolver, ComplaintService, TaskService, AreaService],
  exports: [ ComplaintService ]
})
export class ComplaintModule {}
