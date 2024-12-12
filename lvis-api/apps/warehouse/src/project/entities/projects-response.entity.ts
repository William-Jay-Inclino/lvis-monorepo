import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Project } from "./project.entity";
import { Project as P } from "apps/warehouse/prisma/generated/client";


@ObjectType()
export class ProjectsResponse {
  @Field(() => [Project])
  data: P[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}