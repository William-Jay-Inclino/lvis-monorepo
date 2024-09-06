import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PO } from '../../po/entities/po.entity';
import { APPROVAL_STATUS } from '../../__common__/types';

@ObjectType()
export class POApprover {

  @Field(() => String)
  id: string;

  @Field(() => String)
  po_id: string

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

  @Field(() => PO)
  po: PO


}
