import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class UpdateLineServicesInput {

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
    order_number: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    cause_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    mrv_number: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    seriv_number: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    mst_number: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    mcrt_number: string;

}