import { Field, Int, ObjectType } from "@nestjs/graphql";
import { MCT as M } from "apps/warehouse/prisma/generated/client";
import { MCT } from "./mct.entity";


@ObjectType()
export class MCTsResponse {
  @Field(() => [MCT])
  data: M[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}