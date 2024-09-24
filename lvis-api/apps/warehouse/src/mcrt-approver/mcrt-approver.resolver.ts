import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { MCRTApprover } from './entities/mcrt-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MCRTApprover)
export class McrtApproverResolver {

  @ResolveField(() => Employee)
  approver(@Parent() mcrtApprover: MCRTApprover): any {
    return { __typename: 'Employee', id: mcrtApprover.approver_id }
  }

}
