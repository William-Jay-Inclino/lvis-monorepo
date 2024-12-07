import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Vehicle as V } from "apps/warehouse/prisma/generated/client";
import { Vehicle } from "./vehicle.entity";


@ObjectType()
export class VehiclesResponse {
  @Field(() => [Vehicle])
  data: V[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}