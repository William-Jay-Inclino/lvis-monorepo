import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Item } from '../../item/entities/item.entity';
import { OSRIV } from '../../osriv/entities/osriv.entity';

@ObjectType()
export class OSRIVItem {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  osriv_id: string;

  @Field(() => String)
  item_id: string;

  @Field(() => Int)
  quantity: number;

  @Field({ nullable: true })
  metadata?: string



  // =============== derived / resolvers ===============

  @Field(() => OSRIV)
  osriv: OSRIV;

  @Field(() => Item)
  item: Item;

}
