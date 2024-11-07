import { Field, ObjectType } from "@nestjs/graphql";
import { Vehicle } from "./vehicle.entity";
import { Vehicle as V} from "apps/warehouse/prisma/generated/client";


@ObjectType()
export class UpdateVehicleResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field()
  msg: string;

  @Field(() => Vehicle, { nullable: true })
  data?: V;
}