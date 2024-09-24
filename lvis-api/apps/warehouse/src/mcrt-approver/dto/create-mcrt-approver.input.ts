import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMcrtApproverInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
