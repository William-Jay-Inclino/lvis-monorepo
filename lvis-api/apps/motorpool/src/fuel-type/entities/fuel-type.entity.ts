import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class FuelType {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

}
