import { ObjectType, Field, ID, Directive, Int } from '@nestjs/graphql';

@ObjectType()
export class Shift {

  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  start_time: string;

  @Field()
  end_time: string;

  @Field()
  color_class: string;

  @Field(() => Boolean)
  is_day_off: boolean;

}
