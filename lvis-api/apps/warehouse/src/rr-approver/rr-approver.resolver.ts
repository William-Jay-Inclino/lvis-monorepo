import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { RrApprover } from './entities/rr-approver.entity';
import { Employee } from '../__employee__/entities/employee.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
@UseGuards(GqlAuthGuard)
@Resolver(() => RrApprover)
export class RrApproverResolver {
  @ResolveField(() => Employee)
  approver(@Parent() rrApprover: RrApprover): any {
    return { __typename: 'Employee', id: rrApprover.approver_id }
  }


}
