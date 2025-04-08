import { Field, ObjectType } from "@nestjs/graphql";
import { Item } from "./item.entity";

@ObjectType()
export class UpdateItemPriceResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => Item)
  previous_item: Item;

  @Field(() => Item)
  updated_item: Item;

}