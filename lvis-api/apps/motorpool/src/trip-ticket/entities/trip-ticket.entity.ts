import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { TRIP_TICKET_STATUS } from './trip-ticket.enums';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { TripTicketApprover } from '../../trip-ticket-approver/entities/trip-ticket-approver.entity';

@ObjectType()
export class TripTicket {

  @Field(() => ID)
  id: string;

  @Field()
  vehicle_id: string;

  @Field()
  driver_id: string;

  @Field()
  passengers: string;

  @Field()
  destination: string;

  @Field()
  purpose : string;

  @Field(() => Date)
  start_time: Date;

  @Field(() => Date)
  end_time: Date;

  @Field(() => Date, { nullable: true })
  actual_start_time: Date | null;

  @Field(() => Date, { nullable: true })
  actual_end_time: Date | null;

  @Field(() => Boolean)
  is_operation: boolean 

  @Field(() => Boolean)
  is_stay_in: boolean 

  @Field(() => Boolean)
  is_personal: boolean 

  @Field(() => Boolean)
  is_out_of_coverage: boolean 

  @Field()
  prepared_by_id: string;

  @Field(() => Int)
  status: TRIP_TICKET_STATUS;

  @Field(() => Vehicle)
  vehicle: Vehicle;

  @Field(() => [TripTicketApprover])
  trip_ticket_approvers: TripTicketApprover[]

}
