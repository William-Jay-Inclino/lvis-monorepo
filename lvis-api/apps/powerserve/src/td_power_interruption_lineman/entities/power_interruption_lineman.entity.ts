import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TaskDetailPowerInterruption } from '../../task_detail_power_interruption/entities/task_detail_power_interruption.entity';
import { Lineman } from '../../lineman/entities/lineman.entity';

@ObjectType()
export class PowerInterruptionLineman {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  task_detail_id: number;

  @Field()
  lineman_id: string;



  // =========== relationships ===========  

  @Field(() => TaskDetailPowerInterruption)
  task_detail: TaskDetailPowerInterruption;

  @Field(() => Lineman)
  lineman: Lineman;

}
