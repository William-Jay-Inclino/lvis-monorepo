import { Resolver, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { MSTApprover } from './entities/mst-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeMstApproverInput } from './dto/change-mst-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { MstApproverService } from './mst-approver.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => MSTApprover)
export class MstApproverResolver {

  constructor(
      private readonly mstApproverService: MstApproverService
  ) { }

  @ResolveField(() => Employee)
  approver(@Parent() mstApprover: MSTApprover): any {
    console.log('mstApprover', mstApprover);
    return { __typename: 'Employee', id: mstApprover.approver_id }
  }

  @Mutation(() => MSTApprover)
  async changeMstApprover(
      @Args('id') id: string,
      @Args('input') changeMstApproverInput: ChangeMstApproverInput,
      @CurrentAuthUser() authUser: AuthUser
  ) {
      this.mstApproverService.setAuthUser(authUser)
      return await this.mstApproverService.changeApprover(id, changeMstApproverInput);
  }

}
