import { Resolver, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { MCRTApprover } from './entities/mcrt-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeMcrtApproverInput } from './dto/change-mcrt-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { McrtApproverService } from './mcrt-approver.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => MCRTApprover)
export class McrtApproverResolver {

  private readonly logger = new Logger(McrtApproverResolver.name);
  private filename = 'mcrt-approver.resolver.ts'

  constructor(
      private readonly mcrtApproverService: McrtApproverService,
      private readonly audit: WarehouseAuditService,
  ) { }

  @ResolveField(() => Employee)
  approver(@Parent() mcrtApprover: MCRTApprover): any {
    return { __typename: 'Employee', id: mcrtApprover.approver_id }
  }

  @Mutation(() => MCRTApprover)
  async changeMcrtApprover(
      @Args('id') id: string,
      @Args('input') changeMcrtApproverInput: ChangeMcrtApproverInput,
      @CurrentAuthUser() authUser: AuthUser,
      @UserAgent() user_agent: string,
      @IpAddress() ip_address: string,
  ) {

    this.logger.log('Changing MCRT Approver...', {
      username: authUser.user.username,
      filename: this.filename,
      mcrt_approver_id: id,
      input: JSON.stringify(changeMcrtApproverInput)
    })

    try {
        
        const x = await this.mcrtApproverService.changeApprover(id, changeMcrtApproverInput, {
          ip_address,
          device_info: this.audit.getDeviceInfo(user_agent),
          authUser,
        });
        
        this.logger.log('MCRT Approver changed successfully')
  
        return x
  
    } catch (error) {
        this.logger.error('Error in changing MCRT Approver', error)
    }

  }

}
