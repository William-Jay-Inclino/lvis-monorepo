import { Field, Int, ObjectType } from "@nestjs/graphql";
import { TripTicket as T } from "apps/warehouse/prisma/generated/client";
import { TripTicket } from "./trip-ticket.entity";


@ObjectType()
export class TripTicketsResponse {
  @Field(() => [TripTicket])
  data: T[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}