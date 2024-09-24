import { CreateMcrtInput } from './create-mcrt.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMcrtInput extends PartialType(CreateMcrtInput) {
  @Field(() => Int)
  id: number;
}
