import { Field, Int, ObjectType } from "@nestjs/graphql";
import { RV } from "../../rv/entities/rv.entity";
import { APPROVAL_STATUS } from "../../__common__/types";
import { Employee } from "../../__employee__/entities/employee.entity";


@ObjectType()
export class RVApprover {

    @Field(() => String)
    id: string;

    @Field(() => String)
    rv_id: string

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

    @Field(() => Boolean)
    is_supervisor: boolean



    // =============== derived / resolvers =============== 

    @Field(() => RV)
    rv: RV

    @Field(() => Employee, { nullable: true })
    approver?: Employee | null

}