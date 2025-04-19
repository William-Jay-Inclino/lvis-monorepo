import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateKwhMeterInput {

    @Field(() => [String])
    @IsArray()
    @ArrayNotEmpty()
    linemen_incharge_ids: string[];

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    barangay_id: string;

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
    cause_id: string;

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