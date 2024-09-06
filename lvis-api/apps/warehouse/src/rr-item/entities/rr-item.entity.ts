import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RR } from '../../rr/entities/rr.entity';
import { MeqsSupplierItem } from '../../meqs-supplier-item/entities/meqs-supplier-item.entity';
import { ItemTransaction } from '../../item/entities/item-transaction.entity';

@ObjectType()
export class RrItem {

  @Field(() => ID)
  id: string

  @Field()
  rr_id: string

  @Field()
  meqs_supplier_item_id: string

  @Field(() => Int)
  quantity_accepted: number



  // =============== derived / resolvers ===============

  @Field(() => RR)
  rr: RR

  @Field(() => MeqsSupplierItem)
  meqs_supplier_item: MeqsSupplierItem

  @Field(() => ItemTransaction, { nullable: true })
  item_transaction: ItemTransaction

}
