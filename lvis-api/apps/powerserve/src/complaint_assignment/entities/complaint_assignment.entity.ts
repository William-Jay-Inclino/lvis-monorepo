import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Area } from '../../area/entities/area.entity';
import { Department } from '../../__department__ /entities/department.entity';
import { Division } from '../../__division__/entities/division.entity';

@ObjectType()
export class ComplaintAssignment {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  complaint_id: number;

  @Field({ nullable: true })
  area_id: string | null;

  @Field({ nullable: true })
  department_id: string | null;

  @Field({ nullable: true })
  division_id: string | null;


  // =========== relationships ===========  

  @Field(() => Area, { nullable: true })
  area: Area | null;

  @Field(() => Department, { nullable: true })
  department: Department | null;

  @Field(() => Division, { nullable: true })
  division: Division | null;

}
