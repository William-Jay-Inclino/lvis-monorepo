import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateMstItemSubInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  item_id: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  price: number;

}
