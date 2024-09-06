import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateOsrivApproverInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
