import { CreateMrvApproverInput } from './create-mrv-approver.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMrvApproverInput extends PartialType(CreateMrvApproverInput) {
  @Field(() => Int)
  id: number;
}
