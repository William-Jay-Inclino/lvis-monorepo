import { Module } from '@nestjs/common';
import { TaskDetailKwhMeterService } from './task_detail_kwh_meter.service';
import { TaskDetailKwhMeterResolver } from './task_detail_kwh_meter.resolver';

@Module({
  providers: [TaskDetailKwhMeterResolver, TaskDetailKwhMeterService],
})
export class TaskDetailKwhMeterModule {}
