import { ObjectType, Field, ID, Directive, Int, registerEnumType } from '@nestjs/graphql';
import { Department } from '../../department/entities/department.entity';
import { DivisionStatus } from 'apps/system/prisma/generated/client';

registerEnumType(DivisionStatus, {
  name: 'DivisionStatus',
  description: 'DivisionStatus default is ACTIVE',
});

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

  @Field(() => DivisionStatus)
  status: DivisionStatus;

  @Field({ nullable: true })
  permissions?: string | null 


  // resolvers

  @Field(() => Department)
  department: Department;

}
