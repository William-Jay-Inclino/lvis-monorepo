import { IsOptional, IsString } from 'class-validator';
import { CreateItemTypeInput } from './create-item-type.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemTypeInput extends PartialType(CreateItemTypeInput) {
  @IsOptional()
  @IsString()
  @Field(() => String, {nullable: true})
  code?: string | null;

  @IsOptional()
  @IsString()
  @Field(() => String, {nullable: true})
  name?: string | null;
}
