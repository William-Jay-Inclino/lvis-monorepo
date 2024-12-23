import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Canvass } from '../../canvass/entities/canvass.entity';
import { MEQS } from '../../meqs/entities/meq.entity';
import { JOApprover } from '../../jo-approver/entities/jo-approver.entity';

@ObjectType()
export class JO {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  jo_number: string;

  @Field(() => String)
  date_requested: string;

  @Field(() => String, { nullable: true })
  canvass_id?: string | null;

  @Field(() => String)
  canvass_number: string;

  @Field(() => String, {nullable: true})
  equipment?: string | null;

  @Field(() => String, { nullable: true })
  classification_id: string | null;

  @Field(() => String)
  department_id: string;

  @Field(() => String, { nullable: true })
  division_id: string | null;

  @Field(() => String)
  notes: string;

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

  @Field(() => Canvass, { nullable: true })
  canvass?: Canvass | null;

  @Field(() => MEQS, { nullable: true })
  meqs?: MEQS;

  @Field(() => [JOApprover])
  jo_approvers: JOApprover[]


}
