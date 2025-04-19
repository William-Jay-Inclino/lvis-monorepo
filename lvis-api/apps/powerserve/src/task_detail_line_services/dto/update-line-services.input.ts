import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    order_number?: string | null;

    @Field()
    @IsNotEmpty()
    @IsString()
    cause_id: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    mrv_number?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    seriv_number?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    mst_number?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    mcrt_number?: string | null;

}