import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TaskStatus } from '../../task_status/entities/task_status.entity';

@ObjectType()
export class TaskLog {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  task_id: number;

  @Field(() => Int)
  task_status_id: number;

  @Field()
  remarks: string;

  // =========== relationships ===========  

  @Field(() => TaskStatus)
  status: TaskStatus;

}
