import { Field, ObjectType } from "@nestjs/graphql";
import { Area } from "./area.entity";
import { Area as A } from "apps/powerserve/prisma/generated/client";

@ObjectType()
export class MutationAreaResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => Area, { nullable: true })
  data?: A | null;
}