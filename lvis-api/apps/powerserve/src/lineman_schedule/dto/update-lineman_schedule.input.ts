import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateLinemanScheduleInput {

    @Field()
    @IsNotEmpty()
    @IsString()
    lineman_id: string;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    general_shift_id: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    mon_shift_id: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    tue_shift_id: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    wed_shift_id: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    thu_shift_id: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    fri_shift_id: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    sat_shift_id: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    sun_shift_id: number;

}
