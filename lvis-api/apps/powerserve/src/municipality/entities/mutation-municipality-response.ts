import { Field, ObjectType } from "@nestjs/graphql";
import { Municipality } from "./municipality.entity";
import { Municipality as M } from "apps/powerserve/prisma/generated/client";

@ObjectType()
export class MutationMunicipalityResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => Municipality, { nullable: true })
  data?: M | null;
}