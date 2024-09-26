import { Field, Int, ObjectType } from "@nestjs/graphql";
import { APPROVAL_STATUS } from "../../__common__/types";
import { Employee } from "../../__employee__/entities/employee.entity";
import { OSRIV } from "../../osriv/entities/osriv.entity";


@ObjectType()
export class OSRIVApprover {

    @Field(() => String)
    id: string;

    @Field(() => String)
    osriv_id: string

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

    @Field(() => String)
    label_id: string

    @Field(() => Int)
    order: number

    @Field({ nullable: true })
    metadata?: string


    // =============== derived / resolvers =============== 

    @Field(() => OSRIV)
    osriv: OSRIV

    @Field(() => Employee, { nullable: true })
    approver?: Employee | null

}