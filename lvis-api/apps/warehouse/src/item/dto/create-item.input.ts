import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

@InputType()
export class CreateItemInput {

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  item_type_id: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  unit_id: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  project_id?: string | null

  @Field()
  @IsOptional()
  @IsString()
  description?: string | null

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'Price must be greater than 0' })
  initial_quantity: number

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  alert_level: number

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Initial Average Price must be equal or greater than 0' })
  initial_average_price: number

}
