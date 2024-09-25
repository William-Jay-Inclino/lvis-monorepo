import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { MSTApprover } from './entities/mst-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MSTApprover)
export class MstApproverResolver {

  @ResolveField(() => Employee)
  approver(@Parent() mstApprover: MSTApprover): any {
    return { __typename: 'Employee', id: mstApprover.approver_id }
  }

}
