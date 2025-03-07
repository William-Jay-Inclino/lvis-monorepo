import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Area {

  @Field(() => ID)
  id: string;

  @Field()
  oic_id: string;

  @Field()
  name: string;

}
