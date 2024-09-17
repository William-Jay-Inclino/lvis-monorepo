import { CreateMrvItemInput } from './create-mrv-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMrvItemInput extends PartialType(CreateMrvItemInput) {
  @Field(() => Int)
  id: number;
}
