import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Item } from '../../item/entities/item.entity';
import { MST } from '../../mst/entities/mst.entity';

@ObjectType()
export class MSTItem {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  mst_id: string;

  @Field(() => String)
  item_id: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  status: number;

  @Field({ nullable: true })
  metadata?: string



  // =============== derived / resolvers ===============

  @Field(() => MST)
  mst: MST;

  @Field(() => Item)
  item: Item;

}
