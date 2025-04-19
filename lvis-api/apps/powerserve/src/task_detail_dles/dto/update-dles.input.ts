import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateDlesInput {
    
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

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    cause_id?: string | null;

}