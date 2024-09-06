import { CreateOsrivApproverInput } from './create-osriv-approver.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOsrivApproverInput extends PartialType(CreateOsrivApproverInput) {
  @Field(() => Int)
  id: number;
}
