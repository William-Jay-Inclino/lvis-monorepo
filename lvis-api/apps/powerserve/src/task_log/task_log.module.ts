import { Module } from '@nestjs/common';
import { TaskLogService } from './task_log.service';
import { TaskLogResolver } from './task_log.resolver';

@Module({
  providers: [TaskLogResolver, TaskLogService],
})
export class TaskLogModule {}
