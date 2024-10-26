import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTripTicketApproverInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
