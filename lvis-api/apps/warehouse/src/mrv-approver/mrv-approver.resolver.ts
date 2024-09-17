import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { MRVApprover } from './entities/mrv-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MRVApprover)
export class MrvApproverResolver {

  @ResolveField(() => Employee)
  approver(@Parent() mrvApprover: MRVApprover): any {
    return { __typename: 'Employee', id: mrvApprover.approver_id }
  }

}
