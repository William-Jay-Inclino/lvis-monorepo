import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMrvApproverInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
