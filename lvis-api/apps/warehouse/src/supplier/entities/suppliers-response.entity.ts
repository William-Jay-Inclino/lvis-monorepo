import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Supplier as S } from "apps/warehouse/prisma/generated/client";
import { Supplier } from "./supplier.entity";


@ObjectType()
export class SuppliersResponse {
  @Field(() => [Supplier])
  data: S[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}