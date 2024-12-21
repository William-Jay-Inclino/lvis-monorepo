import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class UpdateCompletionResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field()
  msg: string;

  @Field(() => Boolean)
  is_completed: boolean;
  
}