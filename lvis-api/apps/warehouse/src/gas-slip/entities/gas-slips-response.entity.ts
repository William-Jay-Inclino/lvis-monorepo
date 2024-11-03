import { Field, Int, ObjectType } from "@nestjs/graphql";
import { GasSlip as G } from "apps/warehouse/prisma/generated/client";
import { GasSlip } from "./gas-slip.entity";


@ObjectType()
export class GasSlipsResponse {
  @Field(() => [GasSlip])
  data: G[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}