import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TASK_STATUS } from "../entities/constants";

@InputType()
export class UpdateTaskStatusInput {

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    task_status_id: TASK_STATUS;

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    task_id: number;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    remarks: string;

}