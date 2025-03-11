import { ObjectType, Field, ID, Directive, Int } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class ComplaintStatus {

  @Field(() => Int)
  id: number;

  @Field()
  name: string;

}
