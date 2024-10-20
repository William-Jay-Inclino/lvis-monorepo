import { ObjectType, Field, ID } from '@nestjs/graphql';
import { MCT } from '../../mct/entities/mct.entity';
import { MCRTApprover } from '../../mcrt-approver/entities/mcrt-approver.entity';
import { MCRTItem } from '../../mcrt-item/entities/mcrt-item.entity';
import { SERIV } from '../../seriv/entities/seriv.entity';

@ObjectType()
export class MCRT {

  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  mct_id: string | null;

  @Field(() => String, { nullable: true })
  mct_number: string | null;

  @Field(() => String, { nullable: true })
  seriv_id: string | null;

  @Field(() => String, { nullable: true })
  seriv_number: string | null;

  @Field(() => String)
  mcrt_number: string;

  @Field(() => String)
  mcrt_date: string;

  @Field(() => String)
  returned_by_id: string;

  @Field(() => String, { nullable: true })
  wo_number: string | null;

  @Field(() => String, { nullable: true })
  mo_number: string | null;

  @Field(() => String, { nullable: true })
  jo_number: string | null;

  @Field(() => String)
  note: string;

  @Field(() => Boolean)
  is_completed: boolean;

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

  @Field(() => MCT, { nullable: true })
  mct: MCT | null

  @Field(() => SERIV, { nullable: true })
  seriv: SERIV | null

  @Field(() => [MCRTApprover])
  mcrt_approvers: MCRTApprover[]

  @Field(() => [MCRTItem])
  mcrt_items: MCRTItem[]

}
