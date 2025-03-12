import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Complaint as C } from "apps/powerserve/prisma/generated/client";
import { Complaint } from "./complaint.entity";

@ObjectType()
export class FindAllComplaintResponse {
  @Field(() => [Complaint])
  data: C[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}