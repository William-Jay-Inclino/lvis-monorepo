import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Item } from '../../item/entities/item.entity';
import { MRV } from '../../mrv/entities/mrv.entity';

@ObjectType()
export class MRVItem {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  mrv_id: string;

  @Field(() => String)
  item_id: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;


  // =============== derived / resolvers ===============

  @Field(() => MRV)
  mrv: MRV;

  @Field(() => Item)
  item: Item;

}
