import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class FuelType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

}
