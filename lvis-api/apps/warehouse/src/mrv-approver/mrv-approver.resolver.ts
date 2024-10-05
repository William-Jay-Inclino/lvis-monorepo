import { Resolver, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { MRVApprover } from './entities/mrv-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeMrvApproverInput } from './dto/change-mrv-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { MrvApproverService } from './mrv-approver.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => MRVApprover)
export class MrvApproverResolver {

  constructor(
      private readonly mrvApproverService: MrvApproverService
  ) { }

  @ResolveField(() => Employee)
  approver(@Parent() mrvApprover: MRVApprover): any {
    console.log('mrvApprover', mrvApprover);
    return { __typename: 'Employee', id: mrvApprover.approver_id }
  }

  @Mutation(() => MRVApprover)
  async changeMrvApprover(
      @Args('id') id: string,
      @Args('input') changeMrvApproverInput: ChangeMrvApproverInput,
      @CurrentAuthUser() authUser: AuthUser
  ) {
      this.mrvApproverService.setAuthUser(authUser)
      return await this.mrvApproverService.changeApprover(id, changeMrvApproverInput);
  }

}
