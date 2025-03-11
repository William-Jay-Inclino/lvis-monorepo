import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TaskFile {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  task_id: number;

  @Field()
  filename: string;

  @Field()
  source_path: string;

}
