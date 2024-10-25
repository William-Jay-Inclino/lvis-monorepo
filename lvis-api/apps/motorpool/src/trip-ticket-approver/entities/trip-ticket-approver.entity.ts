import { Field, Int, ObjectType } from "@nestjs/graphql";
import { APPROVAL_STATUS } from "apps/warehouse/src/__common__/types";
import { TripTicket } from "../../trip-ticket/entities/trip-ticket.entity";
import { Employee } from "../../__employee__/entities/employee.entity";


@ObjectType()
export class TripTicketApprover {

    @Field(() => String)
    id: string;

    @Field(() => String)
    trip_ticket_id: string

    @Field(() => String)
    approver_id: string

    @Field(() => String, { nullable: true })
    date_approval: string | null

    @Field(() => String, { nullable: true })
    notes: string

    @Field(() => Int)
    status: APPROVAL_STATUS

    @Field(() => String)
    label: string

    @Field(() => Int)
    order: number



    // =============== derived / resolvers =============== 

    @Field(() => TripTicket)
    trip_ticket: TripTicket

    @Field(() => Employee, { nullable: true })
    approver?: Employee | null

}