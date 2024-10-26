import { CreateTripTicketApproverInput } from './create-trip-ticket-approver.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTripTicketApproverInput extends PartialType(CreateTripTicketApproverInput) {
  @Field(() => Int)
  id: number;
}
