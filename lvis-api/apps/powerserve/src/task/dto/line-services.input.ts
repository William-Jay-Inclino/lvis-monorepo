import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class LineServicesSubInput {

    @Field(() => [String])
    @IsArray()
    @ArrayNotEmpty()
    linemen_incharge_ids: string[];

    @Field()
    @IsNotEmpty()
    @IsString()
    order_number: string;

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