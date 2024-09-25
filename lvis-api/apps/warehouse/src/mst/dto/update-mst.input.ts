import { CreateMstInput } from './create-mst.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMstInput extends PartialType(CreateMstInput) {
  @Field(() => Int)
  id: number;
}
