import { Field, ObjectType } from "@nestjs/graphql";
import { Lineman } from "./lineman.entity";

@ObjectType()
export class MutationLinemanResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => Lineman, { nullable: true })
  data?: Lineman | null;
}