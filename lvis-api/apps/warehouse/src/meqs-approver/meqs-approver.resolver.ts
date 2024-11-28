import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { MEQSApprover } from './entities/meqs-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MEQSApprover)
export class MeqsApproverResolver {

  @ResolveField(() => Employee)
  approver(@Parent() meqsApprover: MEQSApprover): any {
    return { __typename: 'Employee', id: meqsApprover.approver_id }
  }

}
