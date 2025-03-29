import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Station {

  @Field(() => ID)
  id: string;

}
