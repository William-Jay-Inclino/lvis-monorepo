import { Field, ObjectType } from "@nestjs/graphql";
import { Lineman } from "./lineman.entity";
import { Lineman as L } from "apps/powerserve/prisma/generated/client";

@ObjectType()
export class MutationLinemanResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => Lineman, { nullable: true })
  data?: L | null;
}