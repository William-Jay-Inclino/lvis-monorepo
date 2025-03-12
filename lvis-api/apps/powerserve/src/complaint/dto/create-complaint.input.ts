import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
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
    nature_of_complaint_id: string;

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

}