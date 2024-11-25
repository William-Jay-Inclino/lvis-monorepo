import { ObjectType, Field, ID, Directive, registerEnumType } from '@nestjs/graphql';
import { Division } from '../../division/entities/division.entity';
import { DepartmentStatus } from 'apps/system/prisma/generated/client';

registerEnumType(DepartmentStatus, {
  name: 'DepartmentStatus',
  description: 'DepartmentStatus default is ACTIVE',
});

@ObjectType()
@Directive('@key(fields: "id")')
export class Department {

  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field()
  name: string;

  @Field(() => DepartmentStatus)
  status: DepartmentStatus;

  @Field({ nullable: true })
  permissions?: string | null

  @Field(() => Date)
  created_at: Date;


  // derived / resolvers

  @Field(() => [Division])
  divisions: Division[];

}
