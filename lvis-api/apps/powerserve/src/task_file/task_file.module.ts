import { Module } from '@nestjs/common';
import { TaskFileService } from './task_file.service';
import { TaskFileResolver } from './task_file.resolver';

@Module({
  providers: [TaskFileResolver, TaskFileService],
})
export class TaskFileModule {}
