import { Module } from '@nestjs/common';
import { TaskAssignmentService } from './task_assignment.service';
import { TaskAssignmentResolver } from './task_assignment.resolver';

@Module({
  providers: [TaskAssignmentResolver, TaskAssignmentService],
})
export class TaskAssignmentModule {}
