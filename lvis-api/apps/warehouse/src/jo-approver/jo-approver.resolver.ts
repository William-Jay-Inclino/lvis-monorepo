import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { JOApprover } from './entities/jo-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => JOApprover)
export class JoApproverResolver {

  @ResolveField(() => Employee)
  approver(@Parent() joApprover: JOApprover): any {
    return { __typename: 'Employee', id: joApprover.approver_id }
  }

}
