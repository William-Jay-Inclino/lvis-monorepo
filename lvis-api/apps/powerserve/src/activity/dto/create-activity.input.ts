import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreatePowerserveActivityInput {

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    category_id: number;

    @Field()
    @IsNotEmpty()
    @IsString()
    unit_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    code: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field(() => Float)
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    num_of_personnel: number;

}
