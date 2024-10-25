import { CreateGasSlipApproverInput } from './create-gas-slip-approver.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGasSlipApproverInput extends PartialType(CreateGasSlipApproverInput) {
  @Field(() => Int)
  id: number;
}
