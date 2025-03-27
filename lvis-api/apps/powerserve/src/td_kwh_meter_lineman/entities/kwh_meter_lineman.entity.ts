import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Lineman } from '../../lineman/entities/lineman.entity';
import { TaskDetailKwhMeter } from '../../task_detail_kwh_meter/entities/task_detail_kwh_meter.entity';

@ObjectType()
export class KwhMeterLineman {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  task_detail_id: number;

  @Field()
  lineman_id: string;



  // =========== relationships ===========  

  @Field(() => TaskDetailKwhMeter)
  task_detail: TaskDetailKwhMeter;

  @Field(() => Lineman)
  lineman: Lineman;

}
