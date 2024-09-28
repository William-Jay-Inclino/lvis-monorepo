import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ItemType {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  code: string;

  @Field(() => String)
  name: string;

}
