import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Sitio {

  @Field(() => ID)
  id: string;

  @Field()
  barangay_id: string;

  @Field()
  name: string;

}
