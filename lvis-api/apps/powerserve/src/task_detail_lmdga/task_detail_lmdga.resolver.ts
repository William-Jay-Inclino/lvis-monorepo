import { Resolver } from '@nestjs/graphql';
import { TaskDetailLmdgaService } from './task_detail_lmdga.service';

@Resolver()
export class TaskDetailLmdgaResolver {
  constructor(private readonly taskDetailLmdgaService: TaskDetailLmdgaService) {}
}
