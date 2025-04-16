import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Remarks {

  @Field()
  id: string;

  @Field(() => Int)
  min: number;

  @Field(() => Int)
  max: number;

  @Field()
  label: string;

}
