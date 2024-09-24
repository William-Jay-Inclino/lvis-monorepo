import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { MCTApprover } from './entities/mct-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MCTApprover)
export class MctApproverResolver {

  @ResolveField(() => Employee)
  approver(@Parent() mctApprover: MCTApprover): any {
    return { __typename: 'Employee', id: mctApprover.approver_id }
  }

}
