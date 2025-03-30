import { Field, InputType, Int } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class UpdateKwhMeterInput {

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    meter_number: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    meter_brand_id: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    last_reading: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    initial_reading: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    meter_class: string;

    @Field(() => [String])
    @IsArray()
    @ArrayNotEmpty()
    linemen_incharge_ids: string[];

}