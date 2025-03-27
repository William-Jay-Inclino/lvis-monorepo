import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Lineman } from '../../lineman/entities/lineman.entity';
import { TaskDetailDles } from '../../task_detail_dles/entities/task_detail_dles.entity';

@ObjectType()
export class DlesLineman {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  task_detail_id: number;

  @Field()
  lineman_id: string;



  // =========== relationships ===========  

  @Field(() => TaskDetailDles)
  task_detail: TaskDetailDles;

  @Field(() => Lineman)
  lineman: Lineman;

}
