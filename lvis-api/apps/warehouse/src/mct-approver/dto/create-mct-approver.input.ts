import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMctApproverInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
