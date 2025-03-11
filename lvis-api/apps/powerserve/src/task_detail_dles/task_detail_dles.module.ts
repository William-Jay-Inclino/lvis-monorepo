import { Module } from '@nestjs/common';
import { TaskDetailDlesService } from './task_detail_dles.service';
import { TaskDetailDlesResolver } from './task_detail_dles.resolver';

@Module({
  providers: [TaskDetailDlesResolver, TaskDetailDlesService],
})
export class TaskDetailDlesModule {}
