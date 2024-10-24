import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class GasStation {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  location: string;

  @Field(() => String)
  contact_number: string;

}
