import { ObjectType, Field, ID, Directive, Int } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class NatureOfComplaint {

  @Field(() => ID)
  id: string;

  @Field(() => Int)
  category_id: number;

  @Field()
  name: string;

  @Field(() => Int)
  number_of_personnel_required: number;

}
