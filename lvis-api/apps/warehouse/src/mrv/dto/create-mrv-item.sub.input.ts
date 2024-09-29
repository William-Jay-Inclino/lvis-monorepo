import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class CreateMrvItemSubInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  item_id: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  price: number;

}
