import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateOsrivItemInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
