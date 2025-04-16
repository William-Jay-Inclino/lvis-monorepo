import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class UpdatePowerInterruptionInput {

    @Field(() => [String])
    @IsArray()
    @ArrayNotEmpty()
    linemen_incharge_ids: string[];

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    barangay_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    affected_area: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    feeder_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    cause_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    weather_condition_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    device_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    equipment_failed: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    fuse_rating: string;

}