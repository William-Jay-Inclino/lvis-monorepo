import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Lineman } from '../../lineman/entities/lineman.entity';
import { TaskDetailLineServices } from '../../task_detail_line_services/entities/task_detail_line_services.entity';

@ObjectType()
export class LineServicesLineman {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  task_detail_id: number;

  @Field()
  lineman_id: string;



  // =========== relationships ===========  

  @Field(() => TaskDetailLineServices)
  task_detail: TaskDetailLineServices;

  @Field(() => Lineman)
  lineman: Lineman;

}
