import { Field, Int, ObjectType } from "@nestjs/graphql";
import { APPROVAL_STATUS } from "../../__common__/types";
import { SPR } from "../../spr/entities/spr.entity";
import { Employee } from "../../__employee__/entities/employee.entity";


@ObjectType()
export class SPRApprover {

  @Field(() => String)
  id: string;

  @Field(() => String)
  spr_id: string

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

  @Field(() => SPR)
  spr: SPR

  @Field(() => Employee, { nullable: true })
  approver?: Employee | null

}