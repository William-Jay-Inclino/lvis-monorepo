import { Resolver } from '@nestjs/graphql';
import { TaskDetailDlesService } from './task_detail_dles.service';

@Resolver()
export class TaskDetailDlesResolver {
  constructor(private readonly taskDetailDlesService: TaskDetailDlesService) {}
}
