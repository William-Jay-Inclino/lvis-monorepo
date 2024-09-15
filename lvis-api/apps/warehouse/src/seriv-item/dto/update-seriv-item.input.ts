import { CreateSerivItemInput } from './create-seriv-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSerivItemInput extends PartialType(CreateSerivItemInput) {
  @Field(() => Int)
  id: number;
}
