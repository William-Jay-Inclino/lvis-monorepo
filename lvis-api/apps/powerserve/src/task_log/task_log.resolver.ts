import { Resolver } from '@nestjs/graphql';
import { TaskLogService } from './task_log.service';

@Resolver()
export class TaskLogResolver {
  constructor(private readonly taskLogService: TaskLogService) {}
}
