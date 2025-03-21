import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { COMPLAINT_STATUS } from "../entities/constants";

@InputType()
export class UpdateComplaintStatusInput {

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    complaint_status_id: COMPLAINT_STATUS;

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    complaint_id: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    remarks?: string | null;

}