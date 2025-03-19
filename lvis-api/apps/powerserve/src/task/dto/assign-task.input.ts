import { Field, InputType, Int } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


@InputType()
export class AssignTaskInput {

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    task_id: number;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    assignee_id: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    remarks?: string | null;

    @Field(() => Boolean)
    @IsNotEmpty()
    @IsBoolean()
    will_start: boolean;

}