import { Field, Int, ObjectType } from "@nestjs/graphql";
import { JO } from "../../jo/entities/jo.entity";
import { APPROVAL_STATUS } from "../../__common__/types";
import { Employee } from "../../__employee__/entities/employee.entity";


@ObjectType()
export class JOApprover {

  @Field(() => String)
  id: string;

  @Field(() => String)
  jo_id: string

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

  @Field(() => JO)
  jo: JO

  @Field(() => Employee, { nullable: true })
  approver?: Employee | null

}