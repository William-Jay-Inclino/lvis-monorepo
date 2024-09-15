import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSerivItemInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
