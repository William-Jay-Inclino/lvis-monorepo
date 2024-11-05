import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Directive('@key(fields: "id")')
export class Division {

  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field()
  name: string;

}