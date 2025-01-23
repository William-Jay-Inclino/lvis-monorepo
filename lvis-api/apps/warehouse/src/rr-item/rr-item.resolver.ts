import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RrItemService } from './rr-item.service';
import { RrItem } from './entities/rr-item.entity';
import { UpdateRrItemInput } from './dto/update-rr-item.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { UpdateRrItemsInput } from './dto/update-rr-items.input';
import { UpdateRrItemsResponse } from './entities/update-rr-items-response';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
@UseGuards(GqlAuthGuard)
@Resolver(() => RrItem)
export class RrItemResolver {

  private readonly logger = new Logger(RrItemResolver.name);
  private filename = 'rr-item.resolver.ts'

  constructor(
    private readonly rrItemService: RrItemService,
    private readonly audit: WarehouseAuditService,
  ) { }

  @Query(() => RrItem)
  async rr_item(
    @Args('id', { nullable: true }) id?: string,
    @Args('rr_number', { nullable: true }) rr_number?: string,
  ) {
    if (id) {
      return await this.rrItemService.findOne(id);
    }
    if (rr_number) {
      return await this.rrItemService.findByRrNumber(rr_number)
    }
  }

  @Mutation(() => RrItem)
  async updateRrItem(
    @Args('id') id: string,
    @Args('input') updateRrItemInput: UpdateRrItemInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
        this.logger.log({
          username: authUser.user.username,
          filename: this.filename,
          function: 'updateRrItem',
          rr_item_id: id,
          input: JSON.stringify(updateRrItemInput)
        })
        
        this.rrItemService.setAuthUser(authUser)

        const x = await this.rrItemService.update(id, updateRrItemInput);
        
        this.logger.log('RR Item updated successfully')

        return x

    } catch (error) {
        this.logger.error('Error in updating RR Item', error)
    }

  }

  @Mutation(() => UpdateRrItemsResponse)
  async updateRrItems(
    @Args({ name: 'inputs', type: () => [UpdateRrItemsInput] }) inputs: UpdateRrItemsInput[],
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    try {
        this.logger.log({
          username: authUser.user.username,
          filename: this.filename,
          function: 'updateRrItems',
          input: JSON.stringify(inputs)
        })
        
        this.rrItemService.setAuthUser(authUser)

        const x = await this.rrItemService.updateMultiple(inputs, {
          ip_address,
          device_info: this.audit.getDeviceInfo(user_agent)
        });
        
        this.logger.log('RR Items updated successfully')

        return x

    } catch (error) {
        this.logger.error('Error in updating RR Items', error)
    }

  }

}
