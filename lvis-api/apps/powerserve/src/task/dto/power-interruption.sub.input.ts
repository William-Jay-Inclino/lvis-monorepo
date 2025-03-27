import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";


@InputType()
export class PowerInterruptionSubInput {

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
    cause: string;

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