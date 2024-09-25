import { CreateMstItemInput } from './create-mst-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMstItemInput extends PartialType(CreateMstItemInput) {
  @Field(() => Int)
  id: number;
}
