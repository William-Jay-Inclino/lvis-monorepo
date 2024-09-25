import { CreateMstApproverInput } from './create-mst-approver.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMstApproverInput extends PartialType(CreateMstApproverInput) {
  @Field(() => Int)
  id: number;
}
