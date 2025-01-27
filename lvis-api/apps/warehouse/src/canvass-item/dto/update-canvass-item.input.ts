import { InputType, Field, Float } from '@nestjs/graphql';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

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

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.01, { message: 'Quantity must be greater than 0' })
  quantity?: number;

}
