import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMstApproverInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
