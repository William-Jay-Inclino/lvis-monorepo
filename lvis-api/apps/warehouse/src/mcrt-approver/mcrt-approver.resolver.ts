import { Resolver, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { MCRTApprover } from './entities/mcrt-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeMcrtApproverInput } from './dto/change-mcrt-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { McrtApproverService } from './mcrt-approver.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MCRTApprover)
export class McrtApproverResolver {

  constructor(
      private readonly mcrtApproverService: McrtApproverService
  ) { }

  @ResolveField(() => Employee)
  approver(@Parent() mcrtApprover: MCRTApprover): any {
    console.log('mcrtApprover', mcrtApprover);
    return { __typename: 'Employee', id: mcrtApprover.approver_id }
  }

  @Mutation(() => MCRTApprover)
  async changeMcrtApprover(
      @Args('id') id: string,
      @Args('input') changeMcrtApproverInput: ChangeMcrtApproverInput,
      @CurrentAuthUser() authUser: AuthUser
  ) {
      this.mcrtApproverService.setAuthUser(authUser)
      return await this.mcrtApproverService.changeApprover(id, changeMcrtApproverInput);
  }

}
