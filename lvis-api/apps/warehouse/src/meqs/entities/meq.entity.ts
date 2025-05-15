import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { JO } from '../../jo/entities/jo.entity';
import { RV } from '../../rv/entities/rv.entity';
import { SPR } from '../../spr/entities/spr.entity';
import { MEQSApprover } from '../../meqs-approver/entities/meqs-approver.entity';
import { MeqsSupplier } from '../../meqs-supplier/entities/meqs-supplier.entity';
import { MeqsAttachment } from '../../meqs-attachment/entities/meqs-attachment.entity';

@ObjectType()
export class MEQS {

  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  jo_id: string | null;

  @Field(() => String, { nullable: true })
  jo_number: string | null;

  @Field(() => String, { nullable: true })
  rv_id: string | null;
  
  @Field(() => String, { nullable: true })
  rv_number: string | null;

  @Field(() => String, { nullable: true })
  spr_id: string | null;

  @Field(() => String, { nullable: true })
  spr_number: string | null;

  @Field(() => String)
  meqs_number: string;

  @Field(() => String)
  meqs_date: string;

  @Field(() => String)
  notes: string;

  @Field(() => String, { nullable: true })
  meqs_notes: string | null;

  @Field(() => Int, { nullable: true })
  approval_status: number | null;



  // =============== audit fields ===============

  @Field()
  created_by: string;

  @Field({ nullable: true })
  updated_by: string | null;

  @Field({ nullable: true })
  cancelled_by: string | null;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Field(() => Date, { nullable: true })
  cancelled_at: Date | null;



  // =============== derived / resolvers =============== 

  @Field(() => JO, { nullable: true })
  jo: JO | null;

  @Field(() => RV, { nullable: true })
  rv: RV | null;

  @Field(() => SPR, { nullable: true })
  spr: SPR | null;

  @Field(() => [MEQSApprover])
  meqs_approvers: MEQSApprover[];

  @Field(() => [MeqsSupplier])
  meqs_suppliers: MeqsSupplier[];

  @Field(() => [MeqsAttachment])
  attachments: MeqsAttachment[];

}
