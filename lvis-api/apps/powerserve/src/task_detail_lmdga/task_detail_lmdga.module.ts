import { Module } from '@nestjs/common';
import { TaskDetailLmdgaService } from './task_detail_lmdga.service';
import { TaskDetailLmdgaResolver } from './task_detail_lmdga.resolver';

@Module({
  providers: [TaskDetailLmdgaResolver, TaskDetailLmdgaService],
})
export class TaskDetailLmdgaModule {}
