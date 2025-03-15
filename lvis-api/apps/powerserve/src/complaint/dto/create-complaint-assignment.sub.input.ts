import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


@InputType()
export class CreateComplaintAssignmentSubInput {

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    area_id?: string | null;

    @Field(() => String, { nullable: true })
    @IsNotEmpty()
    @IsString()
    department_id: string | null;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    division_id?: string | null;

}