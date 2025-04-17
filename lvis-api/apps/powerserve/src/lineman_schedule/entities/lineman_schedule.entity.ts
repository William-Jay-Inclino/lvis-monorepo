import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LinemanSchedule {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
