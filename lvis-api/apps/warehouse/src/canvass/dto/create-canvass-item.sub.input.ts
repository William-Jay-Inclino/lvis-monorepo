import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class CreateCanvassItemSubInput {

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  unit_id?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  item_id?: string | null;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'Quantity must be greater than 0' })
  quantity: number;

}