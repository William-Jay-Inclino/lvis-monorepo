import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { VAT_TYPE } from '../../__common__/types';
import { MeqsSupplier } from '../../meqs-supplier/entities/meqs-supplier.entity';
import { CanvassItem } from '../../canvass-item/entities/canvass-item.entity';
import { RrItem } from '../../rr-item/entities/rr-item.entity';

@ObjectType()
export class MeqsSupplierItem {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  meqs_supplier_id: string;

  @Field(() => String)
  canvass_item_id: string;

  @Field(() => Float)
  price: number;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => Boolean)
  is_awarded: boolean;

  @Field(() => Int)
  vat_type: VAT_TYPE;




  // =============== derived / resolvers =============== 

  @Field(() => CanvassItem)
  canvass_item: CanvassItem;

  @Field(() => MeqsSupplier)
  meqs_supplier: MeqsSupplier;

  @Field(() => RrItem, { nullable: true })
  rr_item?: RrItem | null;

}
