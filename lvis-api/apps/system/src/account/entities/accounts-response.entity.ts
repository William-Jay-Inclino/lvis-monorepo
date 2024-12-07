import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Account as A } from "apps/system/prisma/generated/client";
import { Account } from "./account.entity";


@ObjectType()
export class AccountsResponse {
  @Field(() => [Account])
  data: A[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}