import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RR } from '../../rr/entities/rr.entity';
import { APPROVAL_STATUS } from '../../__common__/types';
import { Employee } from '../../__employee__/entities/employee.entity';

@ObjectType()
export class RrApprover {

  @Field(() => String)
  id: string;

  @Field(() => String)
  rr_id: string

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

  @Field(() => RR)
  rr: RR

  @Field(() => Employee, { nullable: true })
  approver?: Employee | null

}
