import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Classification as C } from "apps/system/prisma/generated/client";
import { Classification } from "./classification.entity";


@ObjectType()
export class ClassificationsResponse {
  @Field(() => [Classification])
  data: C[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}