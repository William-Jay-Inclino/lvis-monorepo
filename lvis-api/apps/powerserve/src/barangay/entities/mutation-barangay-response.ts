import { Field, ObjectType } from "@nestjs/graphql";
import { Barangay } from "./barangay.entity";
import { Barangay as B } from "apps/powerserve/prisma/generated/client";

@ObjectType()
export class MutationBarangayResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => Barangay, { nullable: true })
  data?: B | null;
}