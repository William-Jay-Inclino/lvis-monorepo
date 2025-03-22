import { IsInt, IsOptional, IsString } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    complaint_id: number | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    assignee_id?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    remarks?: string | null;

}
