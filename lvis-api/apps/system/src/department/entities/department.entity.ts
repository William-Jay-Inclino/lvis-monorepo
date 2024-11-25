import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { DepartmentStatus } from '../../__common__/types';
import { Division } from '../../division/entities/division.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Department {

  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field()
  name: string;

  @Field(() => Int)
  status: DepartmentStatus;

  @Field({ nullable: true })
  permissions?: string | null

  // audit fields

  @Field()
  created_by: string;

  @Field({ nullable: true })
  updated_by: string | null;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;


  // derived / resolvers

  @Field(() => [Division])
  divisions: Division[];

}
