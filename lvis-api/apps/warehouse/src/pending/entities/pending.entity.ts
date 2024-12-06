import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Pending {

  @Field( () => Int )
  id: string;

  @Field()
  approver_id: string;

  @Field()
  reference_number: string;

  @Field()
  reference_table: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  approver_notes: string | null;

  @Field( () => Date)
  transaction_date: Date;

}
