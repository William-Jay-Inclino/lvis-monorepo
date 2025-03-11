import { Resolver } from '@nestjs/graphql';
import { TaskDetailPowerInterruptionService } from './task_detail_power_interruption.service';

@Resolver()
export class TaskDetailPowerInterruptionResolver {
  constructor(private readonly taskDetailPowerInterruptionService: TaskDetailPowerInterruptionService) {}
}
