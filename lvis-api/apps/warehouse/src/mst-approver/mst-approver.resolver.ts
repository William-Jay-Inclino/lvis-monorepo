import { Resolver, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { MSTApprover } from './entities/mst-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeMstApproverInput } from './dto/change-mst-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { MstApproverService } from './mst-approver.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => MSTApprover)
export class MstApproverResolver {

  private readonly logger = new Logger(MstApproverResolver.name);
  private filename = 'mst-approver.resolver.ts'

  constructor(
      private readonly mstApproverService: MstApproverService,
      private readonly audit: WarehouseAuditService,
  ) { }

  @ResolveField(() => Employee)
  approver(@Parent() mstApprover: MSTApprover): any {
    return { __typename: 'Employee', id: mstApprover.approver_id }
  }

  @Mutation(() => MSTApprover)
  async changeMstApprover(
      @Args('id') id: string,
      @Args('input') changeMstApproverInput: ChangeMstApproverInput,
      @CurrentAuthUser() authUser: AuthUser,
      @UserAgent() user_agent: string,
      @IpAddress() ip_address: string,
  ) {

    this.logger.log('Changing MST approver...', {
      username: authUser.user.username,
      filename: this.filename,
      mst_approver_id: id,
      input: JSON.stringify(changeMstApproverInput)
    })

    try {
      
      const x = await this.mstApproverService.changeApprover(id, changeMstApproverInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser,
      });
      
      this.logger.log('MST Approver changed successfully')

      return x

    } catch (error) {
      this.logger.error('Error in changing MST Approver', error)
    }
  }

}
