import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class ItemPriceLog {

	@Field(() => ID)
	id: string;

	@Field(() => String)
	beginning_price: string;

	@Field(() => String)
	beginning_quantity: string;

	@Field(() => Date)
	created_at: Date;

	@Field()
	created_by: string;

}
