import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Device {

  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field()
  name: string;

}
