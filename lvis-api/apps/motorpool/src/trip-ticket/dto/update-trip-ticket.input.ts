import { CreateTripTicketInput } from './create-trip-ticket.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTripTicketInput extends PartialType(CreateTripTicketInput) {
  @Field(() => Int)
  id: number;
}
