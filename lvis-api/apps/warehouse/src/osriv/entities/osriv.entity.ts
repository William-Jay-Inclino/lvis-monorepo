import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { OSRIVApprover } from '../../osriv-approver/entities/osriv-approver.entity';
import { OSRIVItem } from '../../osriv-item/entities/osriv-item.entity';
import { Station } from '../../station/entities/station.entity';

@ObjectType()
export class OSRIV {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  osriv_number: string;

  @Field(() => String)
  date_requested: string;

  @Field(() => String)
  purpose: string;

  @Field(() => String)
  requested_by_id: string;

  @Field(() => String)
  item_from_id: string;

  @Field({ nullable: true })
  metadata?: string

  @Field(() => Date)
  exp_date: Date;

  @Field(() => Int, { nullable: true })
  approval_status: number | null;

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

  @Field(() => [OSRIVApprover])
  osriv_approvers: OSRIVApprover[]

  @Field(() => [OSRIVItem])
  osriv_items: OSRIVItem[]

}
