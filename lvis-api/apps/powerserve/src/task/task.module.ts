import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';
import { ComplaintModule } from '../complaint/complaint.module';
import { TaskDetailKwhMeterService } from '../task_detail_kwh_meter/task_detail_kwh_meter.service';

@Module({
  imports: [ PowerserveAuditModule, forwardRef(() => ComplaintModule)],
  providers: [TaskResolver, TaskService, TaskDetailKwhMeterService],
  exports: [ TaskService ]
})
export class TaskModule {}
