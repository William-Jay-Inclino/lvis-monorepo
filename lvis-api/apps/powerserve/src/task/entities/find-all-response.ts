import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Task as T } from "apps/powerserve/prisma/generated/client";
import { Task } from "./task.entity";

@ObjectType()
export class FindAllTaskResponse {
  @Field(() => [Task])
  data: T[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}