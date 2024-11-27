import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';
import { POApprover } from './entities/po-approver.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => POApprover)
export class PoApproverResolver {
  @ResolveField(() => Employee)
  approver(@Parent() poApprover: POApprover): any {
    return { __typename: 'Employee', id: poApprover.approver_id }
  }

}
