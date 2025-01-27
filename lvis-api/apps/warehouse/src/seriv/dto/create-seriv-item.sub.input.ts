import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class CreateSerivItemSubInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  item_id: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'Quantity must be greater than 0' })
  quantity: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'price must be greater than 0' })
  price: number;

}
