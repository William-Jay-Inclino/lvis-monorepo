import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class DlesSubInput {

    @Field(() => [String])
    @IsArray()
    @ArrayNotEmpty()
    linemen_incharge_ids: string[];

    @Field()
    @IsNotEmpty()
    @IsString()
    sco_number: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    old_serial_number: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    new_serial_number: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    seriv_number: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    kva_rating: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    cause: string;

}