import { Field, Int, ObjectType } from "@nestjs/graphql";
import { MCRT as M } from "apps/warehouse/prisma/generated/client";
import { MCRT } from "./mcrt.entity";


@ObjectType()
export class MCRTsResponse {
  @Field(() => [MCRT])
  data: M[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}