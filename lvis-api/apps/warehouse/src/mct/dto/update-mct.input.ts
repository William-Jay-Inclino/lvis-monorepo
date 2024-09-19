import { CreateMctInput } from './create-mct.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMctInput extends PartialType(CreateMctInput) {
  @Field(() => Int)
  id: number;
}
