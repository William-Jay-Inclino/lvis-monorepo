import { CreateSerivApproverInput } from './create-seriv-approver.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSerivApproverInput extends PartialType(CreateSerivApproverInput) {
  @Field(() => Int)
  id: number;
}
