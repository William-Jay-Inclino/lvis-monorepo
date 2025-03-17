import { ObjectType, Field, Directive, Int } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class TaskStatus {

  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  color_class: string;

  @Field()
  description: string;

}
