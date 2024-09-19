import { CreateMctApproverInput } from './create-mct-approver.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMctApproverInput extends PartialType(CreateMctApproverInput) {
  @Field(() => Int)
  id: number;
}
