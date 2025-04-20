import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


@InputType()
export class KwhMeterSubInput {

    @Field(() => [String])
    @IsArray()
    @ArrayNotEmpty()
    linemen_incharge_ids: string[];

    @Field()
    @IsNotEmpty()
    @IsNumber()
    distance_travel_in_km: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    meter_number: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    meter_brand_id?: string| null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    cause_id?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    last_reading?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    initial_reading?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    meter_class?: string | null;

}