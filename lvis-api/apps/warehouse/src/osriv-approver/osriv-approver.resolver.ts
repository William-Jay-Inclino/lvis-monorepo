import { Resolver, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { OSRIVApprover } from './entities/osriv-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeOsrivApproverInput } from './dto/change-osriv-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { OsrivApproverService } from './osriv-approver.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => OSRIVApprover)
export class OsrivApproverResolver {

  constructor(
      private readonly osrivApproverService: OsrivApproverService
  ) { }

  @ResolveField(() => Employee)
  approver(@Parent() osrivApprover: OSRIVApprover): any {
    return { __typename: 'Employee', id: osrivApprover.approver_id }
  }

  @Mutation(() => OSRIVApprover)
  async changeOsrivApprover(
      @Args('id') id: string,
      @Args('input') changeOsrivApproverInput: ChangeOsrivApproverInput,
      @CurrentAuthUser() authUser: AuthUser
  ) {
      this.osrivApproverService.setAuthUser(authUser)
      return await this.osrivApproverService.changeApprover(id, changeOsrivApproverInput);
  }

}
