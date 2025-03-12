import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


@InputType()
export class CreateComplaintDetailSubInput {

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    account_number?: string | null;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    meter_number?: string | null;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    consumer_id?: string | null;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    barangay_id: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    sitio_id?: string | null;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    landmark?: string | null;

}