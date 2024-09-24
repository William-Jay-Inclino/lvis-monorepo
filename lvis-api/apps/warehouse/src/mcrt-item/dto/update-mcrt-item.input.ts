import { CreateMcrtItemInput } from './create-mcrt-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMcrtItemInput extends PartialType(CreateMcrtItemInput) {
  @Field(() => Int)
  id: number;
}
