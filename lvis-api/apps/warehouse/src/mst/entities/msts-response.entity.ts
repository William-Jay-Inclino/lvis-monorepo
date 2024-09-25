import { Field, Int, ObjectType } from "@nestjs/graphql";
import { MST as M } from "apps/warehouse/prisma/generated/client";
import { MST } from "./mst.entity";


@ObjectType()
export class MSTsResponse {
  @Field(() => [MST])
  data: M[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}