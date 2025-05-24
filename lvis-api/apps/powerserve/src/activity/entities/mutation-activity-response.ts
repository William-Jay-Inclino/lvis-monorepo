import { Field, ObjectType } from "@nestjs/graphql";
import { Activity as A } from "apps/powerserve/prisma/generated/client";
import { Activity } from "./activity.entity";

@ObjectType()
export class MutationPowerserveActivityResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => Activity, { nullable: true })
  data?: A | null;
}