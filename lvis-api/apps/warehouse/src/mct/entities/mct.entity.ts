import { ObjectType, Field, ID } from '@nestjs/graphql';
import { MRV } from '../../mrv/entities/mrv.entity';
import { MCTApprover } from '../../mct-approver/entities/mct-approver.entity';
import { MCRT } from '../../mcrt/entities/mcrt.entity';

@ObjectType()
export class MCT {

  @Field(() => ID)
  id: string;

  @Field()
  mrv_id: string;

  @Field(() => String)
  mct_number: string;

  @Field(() => String)
  mct_date: string;

  @Field({ nullable: true })
  metadata?: string


  // =============== audit fields ===============

  @Field({ nullable: true })
  cancelled_by: string | null;

  @Field()
  created_by: string;

  @Field({ nullable: true })
  updated_by: string | null;

  @Field({ nullable: true })
  cancelled_at: string | null;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;




  // =============== derived / resolvers ===============

  @Field(() => MRV)
  mrv: MRV;

  @Field(() => MCRT, { nullable: true })
  mcrt: MCRT | null;

  @Field(() => [MCTApprover])
  mct_approvers: MCTApprover[]

}
