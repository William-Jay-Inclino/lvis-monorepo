import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
export class BroadcastTo {

  @Field()
  id: string;

  @Field()
  name: string;

}
