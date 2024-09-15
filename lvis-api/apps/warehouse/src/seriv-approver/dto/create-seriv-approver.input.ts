import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSerivApproverInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
