import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateComplaintDetailSubInput } from "./create-complaint-detail.sub.input";
import { Type } from "class-transformer";
import { ASSIGNED_GROUP_TYPE } from "../entities/constants";

// registerEnumType(ASSIGNED_GROUP_TYPE, {
//   name: 'ASSIGNED GROUP TYPE',
//   description: 'Can be Area, Department, or Division',
// });

@InputType()
export class UpdateComplaintInput {

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    complaint_id: number;

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

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    remarks?: string | null;

    @Field(() => CreateComplaintDetailSubInput)
    @Type(() => CreateComplaintDetailSubInput)
    complaint_detail: CreateComplaintDetailSubInput

    @Field(() => Int)
    @IsNotEmpty()
    assigned_group_type: ASSIGNED_GROUP_TYPE;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    assigned_group_id: string;
}