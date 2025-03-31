import { Module } from '@nestjs/common';
import { TaskDetailPowerInterruptionService } from './task_detail_power_interruption.service';
import { TaskDetailPowerInterruptionResolver } from './task_detail_power_interruption.resolver';

@Module({
  providers: [TaskDetailPowerInterruptionResolver, TaskDetailPowerInterruptionService],
  exports: [ TaskDetailPowerInterruptionService ]
})
export class TaskDetailPowerInterruptionModule {}
