import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Item } from '../../item/entities/item.entity';
import { MCRT } from '../../mcrt/entities/mcrt.entity';

@ObjectType()
export class MCRTItem {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  mcrt_id: string;

  @Field(() => String)
  item_id: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  metadata?: string



  // =============== derived / resolvers ===============

  @Field(() => MCRT)
  mcrt: MCRT;

  @Field(() => Item)
  item: Item;

}
