import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Employee } from '../../employee/entities/employee.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class MeqsApproverSetting {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  approver_id: string;

  @Field(() => Employee)
  approver: Employee;

  @Field(() => String)
  label: string;

  @Field(() => Int)
  order: number;

}
