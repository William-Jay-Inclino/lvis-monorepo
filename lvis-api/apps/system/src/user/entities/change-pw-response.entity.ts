import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class ChangePwResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field()
  msg: string;

}