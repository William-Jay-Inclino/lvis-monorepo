import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMstItemInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
