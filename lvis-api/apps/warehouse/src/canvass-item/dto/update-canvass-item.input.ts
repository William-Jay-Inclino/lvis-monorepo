import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCanvassItemInput {
  
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  unit_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  item_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  quantity?: number;

}
