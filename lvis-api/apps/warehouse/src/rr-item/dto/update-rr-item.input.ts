import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class UpdateRrItemInput {

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Quantity must be greater than or equal to 0' })
    quantity_accepted?: number | null

}
