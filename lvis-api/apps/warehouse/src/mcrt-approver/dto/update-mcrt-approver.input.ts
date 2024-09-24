import { CreateMcrtApproverInput } from './create-mcrt-approver.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMcrtApproverInput extends PartialType(CreateMcrtApproverInput) {
  @Field(() => Int)
  id: number;
}
