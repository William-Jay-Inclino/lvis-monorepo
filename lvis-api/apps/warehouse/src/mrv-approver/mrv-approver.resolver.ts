import { Resolver, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { MRVApprover } from './entities/mrv-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeMrvApproverInput } from './dto/change-mrv-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { MrvApproverService } from './mrv-approver.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MRVApprover)
export class MrvApproverResolver {

  private readonly logger = new Logger(MrvApproverResolver.name);
  private filename = 'mrv-approver.resolver.ts'
  
  constructor(
      private readonly mrvApproverService: MrvApproverService
  ) { }

  @ResolveField(() => Employee)
  approver(@Parent() mrvApprover: MRVApprover): any {
    return { __typename: 'Employee', id: mrvApprover.approver_id }
  }

  @Mutation(() => MRVApprover)
  async changeMrvApprover(
      @Args('id') id: string,
      @Args('input') changeMrvApproverInput: ChangeMrvApproverInput,
      @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'changeMrvApprover',
        mrv_approver_id: id,
        input: JSON.stringify(changeMrvApproverInput)
      })
      
      this.mrvApproverService.setAuthUser(authUser)

      const x = await this.mrvApproverService.changeApprover(id, changeMrvApproverInput);
      
      this.logger.log('MRV Approver changed successfully')

      return x

    } catch (error) {
      this.logger.error('Error in changing MRV Approver', error)
    }

  }

}
