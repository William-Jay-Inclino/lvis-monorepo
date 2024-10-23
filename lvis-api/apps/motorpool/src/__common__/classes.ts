import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class MotorpoolRemoveResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;
}