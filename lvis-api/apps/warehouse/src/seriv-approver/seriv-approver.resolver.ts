import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { SERIVApprover } from './entities/seriv-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => SERIVApprover)
export class SerivApproverResolver {

  @ResolveField(() => Employee)
  approver(@Parent() serivApprover: SERIVApprover): any {
    console.log('serivApprover', serivApprover);
    return { __typename: 'Employee', id: serivApprover.approver_id }
  }

}
