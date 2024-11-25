import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Station {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

}
