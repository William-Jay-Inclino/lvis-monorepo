import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Supplier } from '../../supplier/entities/supplier.entity';
import { MeqsSupplierItem } from '../../meqs-supplier-item/entities/meqs-supplier-item.entity';
import { MeqsSupplierAttachment } from '../../meqs-supplier-attachment/entities/meqs-supplier-attachment.entity';
import { MEQS } from '../../meqs/entities/meq.entity';
import { PO } from '../../po/entities/po.entity';

@ObjectType()
export class MeqsSupplier {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  meqs_id: string;

  @Field(() => String)
  supplier_id: string;

  @Field(() => String)
  payment_terms: string;




  // =============== derived / resolvers =============== 


  @Field(() => MEQS)
  meqs: MEQS;

  @Field(() => Supplier)
  supplier: Supplier;

  @Field(() => [MeqsSupplierAttachment])
  attachments: MeqsSupplierAttachment[];

  @Field(() => [MeqsSupplierItem])
  meqs_supplier_items: MeqsSupplierItem[];

  @Field(() => PO, { nullable: true })
  po: PO;

}
