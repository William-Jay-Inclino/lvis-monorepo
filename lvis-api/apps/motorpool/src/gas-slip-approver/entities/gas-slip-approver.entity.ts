import { Field, Int, ObjectType } from "@nestjs/graphql";
import { APPROVAL_STATUS } from "apps/warehouse/src/__common__/types";
import { Employee } from "../../__employee__/entities/employee.entity";
import { GasSlip } from "../../gas-slip/entities/gas-slip.entity";


@ObjectType()
export class GasSlipApprover {

    @Field(() => String)
    id: string;

    @Field(() => String)
    gas_slip_id: string

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

    @Field(() => GasSlip)
    gas_slip: GasSlip

    @Field(() => Employee, { nullable: true })
    approver?: Employee | null

}