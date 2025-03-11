import { Resolver } from '@nestjs/graphql';
import { TaskFileService } from './task_file.service';

@Resolver()
export class TaskFileResolver {
  constructor(private readonly taskFileService: TaskFileService) {}
}
