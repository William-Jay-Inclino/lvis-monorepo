import { ObjectType, Field, Directive, Int } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class ActivityCategory {

  @Field(() => Int)
  id: number;

  @Field()
  name: string;

}
