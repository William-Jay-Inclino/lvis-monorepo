import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Barangay {

  @Field(() => ID)
  id: string;

  @Field()
  municipality_id: string;

  @Field()
  name: string;

}
