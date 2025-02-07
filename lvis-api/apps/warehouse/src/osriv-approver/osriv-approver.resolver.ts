import { Resolver, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { OSRIVApprover } from './entities/osriv-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeOsrivApproverInput } from './dto/change-osriv-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { OsrivApproverService } from './osriv-approver.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => OSRIVApprover)
export class OsrivApproverResolver {

  private readonly logger = new Logger(OsrivApproverResolver.name);
  private filename = 'osriv-approver.resolver.ts'
  
  constructor(
      private readonly osrivApproverService: OsrivApproverService,
      private readonly audit: WarehouseAuditService,
  ) { }

  @ResolveField(() => Employee)
  approver(@Parent() osrivApprover: OSRIVApprover): any {
    return { __typename: 'Employee', id: osrivApprover.approver_id }
  }

  @Mutation(() => OSRIVApprover)
  async changeOsrivApprover(
      @Args('id') id: string,
      @Args('input') changeOsrivApproverInput: ChangeOsrivApproverInput,
      @CurrentAuthUser() authUser: AuthUser,
      @UserAgent() user_agent: string,
      @IpAddress() ip_address: string,
  ) {

    this.logger.log('Changing OSRIV approver...', {
      username: authUser.user.username,
      filename: this.filename,
      osriv_approver_id: id,
      input: JSON.stringify(ChangeOsrivApproverInput)
    })

    try {
      
      const x = await this.osrivApproverService.changeApprover(id, changeOsrivApproverInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser,
      });
      
      this.logger.log('OSRIV Approver changed successfully')

      return x

    } catch (error) {
      this.logger.error('Error in changing OSRIV Approver', error)
    }

  }

}
