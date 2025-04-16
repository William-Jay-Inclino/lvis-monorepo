import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Equipment {

  @Field()
  id: string;

  @Field()
  code: string;

  @Field()
  name: string;

}
