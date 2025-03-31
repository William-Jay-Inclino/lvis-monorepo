import { Module } from '@nestjs/common';
import { TaskDetailLineServicesService } from './task_detail_line_services.service';
import { TaskDetailLineServicesResolver } from './task_detail_line_services.resolver';

@Module({
  providers: [TaskDetailLineServicesResolver, TaskDetailLineServicesService],
  exports: [ TaskDetailLineServicesService ]
})
export class TaskDetailLineServicesModule {}
