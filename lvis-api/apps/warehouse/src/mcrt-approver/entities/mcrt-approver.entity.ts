import { Field, Int, ObjectType } from "@nestjs/graphql";
import { APPROVAL_STATUS } from "../../__common__/types";
import { Employee } from "../../__employee__/entities/employee.entity";
import { MCRT } from "../../mcrt/entities/mcrt.entity";


@ObjectType()
export class MCRTApprover {

    @Field(() => String)
    id: string;

    @Field(() => String)
    mcrt_id: string

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

    @Field(() => MCRT)
    mcrt: MCRT

    @Field(() => Employee, { nullable: true })
    approver?: Employee | null

}