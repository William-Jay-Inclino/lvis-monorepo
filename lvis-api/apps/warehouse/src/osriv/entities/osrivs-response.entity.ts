import { Field, Int, ObjectType } from "@nestjs/graphql";
import { OSRIV as O } from "apps/warehouse/prisma/generated/client";
import { OSRIV } from "./osriv.entity";


@ObjectType()
export class OSRIVsResponse {
  @Field(() => [OSRIV])
  data: O[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}