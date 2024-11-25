import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { MEQS } from '../../meqs/entities/meq.entity';
import { APPROVAL_STATUS } from '../../__common__/types';

@ObjectType()
export class MEQSApprover {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  meqs_id: string

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

  @Field(() => MEQS)
  meqs: MEQS

}
