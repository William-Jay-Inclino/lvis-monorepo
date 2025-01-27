import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class CreateRRItemSubInput {

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    meqs_supplier_item_id: string;

    @Field(() => Float)
    @IsNotEmpty()
    @IsNumber()
    @Min(0.01, { message: 'Quantity must be greater than 0' })
    quantity_accepted: number;

}