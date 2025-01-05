import { Field, ObjectType } from "@nestjs/graphql";
import { Employee } from "./employee.entity";
import { Employee as E } from "apps/system/prisma/generated/client";

@ObjectType()
export class EmployeeMutationResponse {
    @Field(() => Boolean)
    success: boolean;
  
    @Field(() => String)
    msg: string;

    @Field(() => Employee, { nullable: true })
    data?: E;
}