import { Field, InputType, Int } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";


@InputType()
export class AssignTaskInput {

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    task_id: number;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    assigned_to_id: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    remarks: string;

    @Field(() => Boolean)
    @IsNotEmpty()
    @IsBoolean()
    will_start: boolean;

}