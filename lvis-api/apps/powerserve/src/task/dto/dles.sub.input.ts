import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class DlesSubInput {

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
    sco_number?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    old_serial_number?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    new_serial_number?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    seriv_number?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    kva_rating?: string | null;

    @Field()
    @IsNotEmpty()
    @IsString()
    cause_id: string;

}