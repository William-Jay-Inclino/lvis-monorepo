import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateMEQSSettingOrderInput {
  @Field(() => String)
  id: string;

  @Field(() => Int)
  order: number;
}
