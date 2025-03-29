import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Lineman } from '../../lineman/entities/lineman.entity';
import { TaskDetailLmdga } from '../../task_detail_lmdga/entities/task_detail_lmdga.entity';

@ObjectType()
export class LmdgaLineman {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  task_detail_id: number;

  @Field()
  lineman_id: string;



  // =========== relationships ===========  

  @Field(() => TaskDetailLmdga)
  task_detail: TaskDetailLmdga;

  @Field(() => Lineman)
  lineman: Lineman;

}
