import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Item } from '../../item/entities/item.entity';
import { SERIV } from '../../seriv/entities/seriv.entity';

@ObjectType()
export class SERIVItem {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  seriv_id: string;

  @Field(() => String)
  item_id: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;


  // =============== derived / resolvers ===============

  @Field(() => SERIV)
  seriv: SERIV;

  @Field(() => Item)
  item: Item;

}
