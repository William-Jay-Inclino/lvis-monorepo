import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { SPRApprover } from './entities/spr-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => SPRApprover)
export class SprApproverResolver {

  @ResolveField(() => Employee)
  approver(@Parent() sprApprover: SPRApprover): any {
    return { __typename: 'Employee', id: sprApprover.approver_id }
  }

}
