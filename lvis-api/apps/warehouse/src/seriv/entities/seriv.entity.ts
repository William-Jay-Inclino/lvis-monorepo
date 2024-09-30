import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Station } from '../../station/entities/station.entity';
import { SERIVApprover } from '../../seriv-approver/entities/seriv-approver.entity';
import { SERIVItem } from '../../seriv-item/entities/seriv-item.entity';
import { WAREHOUSE_REQUEST_TYPE } from '../../__common__/constants';
import { MCRT } from '../../mcrt/entities/mcrt.entity';

@ObjectType()
export class SERIV {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  seriv_number: string;

  @Field(() => String)
  date_requested: string;

  @Field(() => String)
  purpose: string;

  @Field(() => Int)
  request_type: WAREHOUSE_REQUEST_TYPE;

  @Field(() => String, { nullable: true })
  or_number: string | null;

  @Field(() => String, { nullable: true })
  mwo_number: string | null;

  @Field(() => String, { nullable: true })
  cwo_number: string | null;

  @Field(() => String)
  jo_number: string;

  @Field(() => String)
  consumer_name: string;

  @Field(() => String)
  location: string;

  @Field(() => String)
  requested_by_id: string;

  @Field(() => String, { nullable: true })
  withdrawn_by_id: string | null;

  @Field(() => String)
  item_from_id: string;

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

  @Field(() => [MCRT])
  mcrts: MCRT[];

  @Field(() => Station)
  item_from: Station;

  @Field(() => [SERIVApprover])
  seriv_approvers: SERIVApprover[]

  @Field(() => [SERIVItem])
  seriv_items: SERIVItem[]

}
