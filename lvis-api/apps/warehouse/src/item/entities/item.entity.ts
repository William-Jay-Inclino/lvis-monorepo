import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Unit } from '../../unit/entities/unit.entity';
import { ItemTransaction } from './item-transaction.entity';
import { ItemType } from '../../item-type/entities/item-type.entity';
import { ProjectItem } from '../../project/entities/project-item.entity';

@ObjectType()
export class Item {

  @Field(() => ID)
  id: string;

  @Field(() => Int)
  item_type_id: number;

  @Field()
  unit_id: string;

  @Field()
  code: string;

  @Field({ nullable: true })
  description: string | null;

  @Field(() => Int)
  total_quantity: number;

  @Field(() => Int)
  quantity_on_queue: number;

  // @Field(() => Int)
  // initial_quantity: number;

  @Field(() => Int)
  alert_level: number;

  @Field()
  created_by: string;

  @Field({ nullable: true })
  updated_by: string | null;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;



  // =============== derived / resolvers =============== 

  @Field(() => [ItemTransaction])
  item_transactions: ItemTransaction[];

  @Field(() => Unit)
  unit: Unit;

  @Field(() => Int)
  average_price: number;

  @Field(() => ItemType)
  item_type: ItemType;

  @Field(() => ProjectItem, { nullable: true })
  project_item: ProjectItem | null;

}
