import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class UpdateRrItemsInput {

    @Field(() => String)
    @IsNotEmpty()
    id: string

    @Field(() => Float)
    @IsNotEmpty()
    @IsNumber()
    @Min(0.01, { message: 'Quantity must be greater than 0' })
    quantity_accepted: number

}
