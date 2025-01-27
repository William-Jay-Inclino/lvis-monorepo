import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Unit } from '../../unit/entities/unit.entity';
import { MeqsSupplierItem } from '../../meqs-supplier-item/entities/meqs-supplier-item.entity';
import { Canvass } from '../../canvass/entities/canvass.entity';
import { Item } from '../../item/entities/item.entity';

@ObjectType()
export class CanvassItem {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  canvass_id: string;

  @Field(() => String, { nullable: true })
  unit_id: string;

  @Field(() => String, { nullable: true })
  item_id: string;

  @Field(() => String)
  description: string;

  @Field(() => Float)
  quantity: number;


  // =============== derived / resolvers =============== 

  @Field(() => [MeqsSupplierItem])
  meqs_supplier_items: MeqsSupplierItem[]

  @Field(() => Canvass)
  canvass: Canvass;

  @Field(() => Unit, { nullable: true })
  unit: Unit | null;

  @Field(() => Item, { nullable: true })
  item: Item;

}

