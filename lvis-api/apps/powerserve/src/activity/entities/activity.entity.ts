import { ObjectType, Field, ID, Directive, Int } from '@nestjs/graphql';
import { ActivityCategory } from '../../activity_category/entities/activity_category.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Activity {

  @Field(() => ID)
  id: string;

  @Field(() => Int)
  category_id: number;

  @Field(() => String)
  unit_id: string;

  @Field()
  code: string;

  @Field()
  name: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  num_of_personnel: number;

  @Field(() => ActivityCategory)
  category: ActivityCategory

}
