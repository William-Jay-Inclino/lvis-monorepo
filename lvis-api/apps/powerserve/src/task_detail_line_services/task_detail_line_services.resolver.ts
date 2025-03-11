import { Resolver } from '@nestjs/graphql';
import { TaskDetailLineServicesService } from './task_detail_line_services.service';

@Resolver()
export class TaskDetailLineServicesResolver {
  constructor(private readonly taskDetailLineServicesService: TaskDetailLineServicesService) {}
}
