import { CreateGasSlipInput } from './create-gas-slip.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGasSlipInput extends PartialType(CreateGasSlipInput) {
  @Field(() => Int)
  id: number;
}
