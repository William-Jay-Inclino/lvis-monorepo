import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateComplaintDetailSubInput } from "./create-complaint-detail.sub.input";
import { Type } from "class-transformer";


@InputType()
export class CreateComplaintInput {

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    report_type_id: number;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    complainant_name: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    complainant_contact_no: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    description: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    remarks: string;

    @Field(() => CreateComplaintDetailSubInput)
    @Type(() => CreateComplaintDetailSubInput)
    complaint_detail: CreateComplaintDetailSubInput

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    area_id?: string | null;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    department_id?: string | null;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    division_id?: string | null;
}