import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateGasSlipApproverInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
