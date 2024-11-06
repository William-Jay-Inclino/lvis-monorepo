import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateActualTimeInput {
  @Field()
  rf_id: string;
}
