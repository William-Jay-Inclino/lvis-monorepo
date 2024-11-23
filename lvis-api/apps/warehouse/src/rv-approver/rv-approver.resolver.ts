import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { RVApprover } from './entities/rv-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => RVApprover)
export class RvApproverResolver {

  @ResolveField(() => Employee)
  approver(@Parent() rvApprover: RVApprover): any {
    console.log('rvApprover', rvApprover);
    return { __typename: 'Employee', id: rvApprover.approver_id }
  }

}
