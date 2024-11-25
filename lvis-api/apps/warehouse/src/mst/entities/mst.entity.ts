import { ObjectType, Field, ID } from '@nestjs/graphql';
import { MSTApprover } from '../../mst-approver/entities/mst-approver.entity';
import { MSTItem } from '../../mst-item/entities/mst-item.entity';

@ObjectType()
export class MST {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  mst_number: string;

  @Field(() => String)
  mst_date: string;

  @Field(() => String)
  returned_by_id: string;

  @Field(() => String, { nullable: true })
  cwo_number: string | null;

  @Field(() => String, { nullable: true })
  mwo_number: string | null;

  @Field(() => String, { nullable: true })
  jo_number: string | null;

  @Field(() => String)
  remarks: string;


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

  @Field(() => [MSTApprover])
  mst_approvers: MSTApprover[]

  @Field(() => [MSTItem])
  mst_items: MSTItem[]

}
