import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";


@InputType()
export class KwhMeterSubInput {

    @Field()
    @IsNotEmpty()
    @IsString()
    lineman_incharge_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    meter_number: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    meter_brand_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    last_reading: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    initial_reading: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    meter_class: string;

}