import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Employee } from "apps/system/src/employee/entities/employee.entity";


@ObjectType()
export class MEQSApproverSetting {

    @Field(() => String)
    id: string;

    @Field(() => String)
    approver_id: string

    @Field(() => Employee)
    approver: Employee

    @Field(() => String)
    label: string
    
    @Field(() => Int)
    order: number

    @Field(() => Date)
    created_at: Date;
  
    @Field(() => Date)
    updated_at: Date;
}