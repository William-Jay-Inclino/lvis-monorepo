import { Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { GasSlipApproverService } from './gas-slip-approver.service';
import { GasSlipApprover } from './entities/gas-slip-approver.entity';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeGasSlipApproverInput } from './dto/change-gas-slip-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => GasSlipApprover)
export class GasSlipApproverResolver {

    private readonly logger = new Logger(GasSlipApproverResolver.name);
    private filename = 'gas-slip-approver.resolver.ts'

  constructor(private readonly gasSlipApproverService: GasSlipApproverService) {}

  @ResolveField(() => Employee)
  approver(@Parent() gasSlipApprover: GasSlipApprover): any {
    return { __typename: 'Employee', id: gasSlipApprover.approver_id }
  }

  @Mutation(() => GasSlipApprover)
  async changeGasSlipApprover(
      @Args('id') id: string,
      @Args('input') input: ChangeGasSlipApproverInput,
      @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'changeGasSlipApprover',
        input: JSON.stringify(input),
        gas_slip_approver_id: id,
      })
      
      this.gasSlipApproverService.setAuthUser(authUser)

      const x = await this.gasSlipApproverService.changeApprover(id, input);
      
      this.logger.log('Gas Slip Approver successfully')

      return x

    } catch (error) {
      this.logger.error('Error in changing gas slip approver', error)
    }

  }
  
}
