import { ObjectType, Field } from '@nestjs/graphql';
import { TripTicket } from './trip-ticket.entity';
import { TripTicket as T } from "apps/warehouse/prisma/generated/client";

@ObjectType()
export class UpdateActualTimeResponse {
  @Field()
  success: boolean;

  @Field()
  msg: string;

  @Field(() => TripTicket)
  data: T;
}
