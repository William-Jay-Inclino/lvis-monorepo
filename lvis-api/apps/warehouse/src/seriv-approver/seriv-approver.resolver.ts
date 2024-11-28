import { Resolver, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { SERIVApprover } from './entities/seriv-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeSerivApproverInput } from './dto/change-seriv-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { SerivApproverService } from './seriv-approver.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => SERIVApprover)
export class SerivApproverResolver {

  private readonly logger = new Logger(SerivApproverResolver.name);
  private filename = 'seriv-approver.resolver.ts'

  constructor(
      private readonly serivApproverService: SerivApproverService
  ) { }

  @ResolveField(() => Employee)
  approver(@Parent() serivApprover: SERIVApprover): any {
    return { __typename: 'Employee', id: serivApprover.approver_id }
  }

  @Mutation(() => SERIVApprover)
  async changeSerivApprover(
      @Args('id') id: string,
      @Args('input') changeSerivApproverInput: ChangeSerivApproverInput,
      @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'changeSerivApprover',
        seriv_approver_id: id,
        input: JSON.stringify(changeSerivApproverInput)
      })
      
      this.serivApproverService.setAuthUser(authUser)

      const x = await this.serivApproverService.changeApprover(id, changeSerivApproverInput);
      
      this.logger.log('SERIV Approver changed successfully')

      return x

    } catch (error) {
      this.logger.error('Error in changing SERIV Approver', error)
    }
  }

}
