import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Station {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  location: string;

  @Field()
  created_by: string;

  @Field({ nullable: true })
  updated_by: string | null;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

}
