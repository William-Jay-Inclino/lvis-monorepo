import { Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { GasSlipApproverService } from './gas-slip-approver.service';
import { GasSlipApprover } from './entities/gas-slip-approver.entity';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeGasSlipApproverInput } from './dto/change-gas-slip-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Resolver(() => GasSlipApprover)
export class GasSlipApproverResolver {
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
      this.gasSlipApproverService.setAuthUser(authUser)
      return await this.gasSlipApproverService.changeApprover(id, input);
  }
  
}
