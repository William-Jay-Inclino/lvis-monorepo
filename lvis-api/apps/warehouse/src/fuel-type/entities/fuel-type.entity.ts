import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class FuelType {
  @Field(() => Int)
  id: string;

  @Field(() => String)
  name: string;

}
