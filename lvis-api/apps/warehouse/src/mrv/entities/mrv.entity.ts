import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Station } from '../../station/entities/station.entity';
import { MRVApprover } from '../../mrv-approver/entities/mrv-approver.entity';
import { MRVItem } from '../../mrv-item/entities/mrv-item.entity';
import { WAREHOUSE_REQUEST_TYPE } from '../../__common__/constants';
import { Project } from '../../project/entities/project.entity';

@ObjectType()
export class MRV {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  project_id: string;

  @Field(() => String)
  mrv_number: string;

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

  @Field(() => Station)
  item_from: Station;

  @Field(() => Project)
  project: Project;

  @Field(() => [MRVApprover])
  mrv_approvers: MRVApprover[]

  @Field(() => [MRVItem])
  mrv_items: MRVItem[]

}
