import { CreateMrvInput } from './create-mrv.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMrvInput extends PartialType(CreateMrvInput) {
  @Field(() => Int)
  id: number;
}
