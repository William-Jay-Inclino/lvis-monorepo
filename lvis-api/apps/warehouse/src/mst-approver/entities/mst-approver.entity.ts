import { Field, Int, ObjectType } from "@nestjs/graphql";
import { APPROVAL_STATUS } from "../../__common__/types";
import { Employee } from "../../__employee__/entities/employee.entity";
import { MST } from "../../mst/entities/mst.entity";


@ObjectType()
export class MSTApprover {

    @Field(() => String)
    id: string;

    @Field(() => String)
    mst_id: string

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

    @Field(() => MST)
    mst: MST

    @Field(() => Employee, { nullable: true })
    approver?: Employee | null

}