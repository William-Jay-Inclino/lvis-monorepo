import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { UserEmployee } from '../../user/entities/user-employee.entity';
import { Department } from '../../department/entities/department.entity';
import { Division } from '../../division/entities/division.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Employee {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  firstname: string;

  @Field(() => String, { nullable: true })
  middlename?: string | null;

  @Field(() => String)
  lastname: string;

  @Field(() => String, { nullable: true })
  position: string;

  @Field(() => String)
  department_id: string;

  @Field(() => String, { nullable: true })
  division_id: string | null;

  @Field(() => String, { nullable: true })
  signature_src?: string | null;

  // =============== audit fields =============== 

  @Field()
  created_by: string;

  @Field({ nullable: true })
  updated_by: string | null;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;



  // =============== derived / resolvers =============== 

  @Field(() => UserEmployee, { nullable: true })
  user_employee?: UserEmployee;

  @Field(() => Department)
  department: Department;

  @Field(() => Division, { nullable: true })
  division: Division | null;
}

