import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SERIV as S } from "apps/warehouse/prisma/generated/client";
import { SERIV } from "./seriv.entity";


@ObjectType()
export class SERIVsResponse {
  @Field(() => [SERIV])
  data: S[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}