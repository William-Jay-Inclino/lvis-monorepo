import { Field, Int, ObjectType } from "@nestjs/graphql";
import { MRV as M } from "apps/warehouse/prisma/generated/client";
import { MRV } from "./mrv.entity";


@ObjectType()
export class MRVsResponse {
  @Field(() => [MRV])
  data: M[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}