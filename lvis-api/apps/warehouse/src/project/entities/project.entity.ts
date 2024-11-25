import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Project {

  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field()
  created_by: string;

  @Field({ nullable: true })
  updated_by: string | null;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

}
