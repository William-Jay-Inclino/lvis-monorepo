import { Field, ObjectType } from "@nestjs/graphql";
import { Sitio } from "./sitio.entity";
import { Sitio as S } from "apps/powerserve/prisma/generated/client";

@ObjectType()
export class MutationSitioResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => Sitio, { nullable: true })
  data?: S | null;
}