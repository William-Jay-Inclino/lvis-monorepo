import { Resolver } from '@nestjs/graphql';
import { TaskDetailKwhMeterService } from './task_detail_kwh_meter.service';

@Resolver()
export class TaskDetailKwhMeterResolver {
  constructor(private readonly taskDetailKwhMeterService: TaskDetailKwhMeterService) {}
}
