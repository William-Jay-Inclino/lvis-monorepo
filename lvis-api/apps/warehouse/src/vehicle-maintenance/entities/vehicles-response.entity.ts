import { Field, Int, ObjectType } from "@nestjs/graphql";
import { VehicleMaintenance as VM } from "apps/warehouse/prisma/generated/client";
import { VehicleMaintenance } from "./vehicle-maintenance.entity";


@ObjectType()
export class VehicleMaintenanceResponse {
  @Field(() => [VehicleMaintenance])
  data: VM[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}