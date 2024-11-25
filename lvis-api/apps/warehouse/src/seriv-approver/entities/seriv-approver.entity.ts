import { Field, Int, ObjectType } from "@nestjs/graphql";
import { APPROVAL_STATUS } from "../../__common__/types";
import { Employee } from "../../__employee__/entities/employee.entity";
import { SERIV } from "../../seriv/entities/seriv.entity";


@ObjectType()
export class SERIVApprover {

    @Field(() => String)
    id: string;

    @Field(() => String)
    seriv_id: string

    @Field(() => String)
    approver_id: string

    @Field(() => String, { nullable: true })
    date_approval: string | null

    @Field(() => String, { nullable: true })
    notes: string

    @Field(() => Int)
    status: APPROVAL_STATUS

    @Field(() => String)
    label: string

    @Field(() => Int)
    order: number


    // =============== derived / resolvers =============== 

    @Field(() => SERIV)
    seriv: SERIV

    @Field(() => Employee, { nullable: true })
    approver?: Employee | null

}