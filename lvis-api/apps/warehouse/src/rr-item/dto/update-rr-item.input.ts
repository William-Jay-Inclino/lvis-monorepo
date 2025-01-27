import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class UpdateRrItemInput {

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    quantity_accepted?: number | null

}
