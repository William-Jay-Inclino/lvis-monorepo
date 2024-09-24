import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMcrtItemInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
