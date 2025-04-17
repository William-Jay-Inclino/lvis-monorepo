import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ActivityCategoryCause {

  @Field()
  id: string;

  @Field({ nullable: true })
  category_id: number | null;

  @Field({ nullable: true })
  code: string | null;

  @Field()
  name: string;

}
