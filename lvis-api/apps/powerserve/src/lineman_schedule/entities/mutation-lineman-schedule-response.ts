import { Field, ObjectType } from "@nestjs/graphql";
import { LinemanSchedule } from "./lineman_schedule.entity";
import { LinemanSchedule as L } from "apps/powerserve/prisma/generated/client";

@ObjectType()
export class MutationLinemanScheduleResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => LinemanSchedule, { nullable: true })
  data?: L | null;
}