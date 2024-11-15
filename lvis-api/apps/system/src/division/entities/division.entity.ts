import { ObjectType, Field, ID, Directive, Int } from '@nestjs/graphql';
import { DivisionStatus } from '../../__common__/types';
import { Department } from '../../department/entities/department.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Division {

  @Field(() => ID)
  id: string;

  @Field()
  department_id: string;

  @Field()
  code: string;

  @Field()
  name: string;

  @Field(() => Int)
  status: DivisionStatus;

  @Field({ nullable: true })
  permissions?: string | null 


  // resolvers

  @Field(() => Department)
  department: Department;

}
