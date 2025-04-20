import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
    @IsNumber()
    distance_travel_in_km: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    affected_area?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    feeder_id?: string| null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    cause_id?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    weather_condition_id?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    device_id?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    equipment_failed_id?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    fuse_rating?: string | null;

}