import { CreateOsrivItemInput } from './create-osriv-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOsrivItemInput extends PartialType(CreateOsrivItemInput) {
  @Field(() => Int)
  id: number;
}
