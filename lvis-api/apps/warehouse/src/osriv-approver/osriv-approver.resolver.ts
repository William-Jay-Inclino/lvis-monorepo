import { Resolver, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { OSRIVApprover } from './entities/osriv-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeOsrivApproverInput } from './dto/change-osriv-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { OsrivApproverService } from './osriv-approver.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => OSRIVApprover)
export class OsrivApproverResolver {

  private readonly logger = new Logger(OsrivApproverResolver.name);
  private filename = 'osriv-approver.resolver.ts'
  
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

    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'changeOsrivApprover',
        osriv_approver_id: id,
        input: JSON.stringify(ChangeOsrivApproverInput)
      })
      
      this.osrivApproverService.setAuthUser(authUser)

      const x = await this.osrivApproverService.changeApprover(id, changeOsrivApproverInput);
      
      this.logger.log('OSRIV Approver changed successfully')

      return x

    } catch (error) {
      this.logger.error('Error in changing OSRIV Approver', error)
    }

  }

}
