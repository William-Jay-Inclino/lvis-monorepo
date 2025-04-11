import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class ItemPriceLog {

	@Field(() => ID)
	id: string;

	@Field(() => Float)
	beginning_price: number;

	@Field(() => Float)
	beginning_quantity: number;

	@Field(() => Date)
	created_at: Date;

	@Field()
	created_by: string;

}
