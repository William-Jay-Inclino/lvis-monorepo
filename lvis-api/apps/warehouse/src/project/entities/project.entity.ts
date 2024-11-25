import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Project {

  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

}
