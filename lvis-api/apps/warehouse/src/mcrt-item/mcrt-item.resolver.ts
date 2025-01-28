import { Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { McrtItemService } from './mcrt-item.service';
import { MCRTItem } from './entities/mcrt-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { CreateMcrtItemSubInput } from '../mcrt/dto/create-mcrt-item.sub.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { MCRT } from '../mcrt/entities/mcrt.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MCRTItem)
export class McrtItemResolver {

    private readonly logger = new Logger(McrtItemResolver.name);
    private filename = 'mcrt-item.resolver.ts'

    constructor(
        private readonly mcrtItemService: McrtItemService,
        private readonly audit: WarehouseAuditService,
    ) {}

    @Mutation(() => MCRT)
    async updateMcrtItems(
        @Args('mcrt_id') mcrt_id: string,
        @Args({ name: 'items', type: () => [CreateMcrtItemSubInput] }) items: CreateMcrtItemSubInput[],
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Updating MCRT items', {
          username: authUser.user.username,
          filename: this.filename,
          mcrt_id,
          items: JSON.stringify(items)
        })

        try {
            
            this.mcrtItemService.setAuthUser(authUser)
      
            const x = await this.mcrtItemService.updateMcrtItems(mcrt_id, items, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            });
            
            this.logger.log('MCRT Items updated successfully')
      
            return x
      
        } catch (error) {
            this.logger.error('Error in updating MCRT Items', error)
        }
    }

    @ResolveField(() => Number)
    reference_qty(@Parent() mcrtItem: MCRTItem): number {
        return this.mcrtItemService.get_reference_qty(mcrtItem.mcrt, mcrtItem.item_id)
    }

    @ResolveField(() => Number)
    qty_returned(@Parent() mcrtItem: MCRTItem): number {
        return this.mcrtItemService.get_qty_returned(mcrtItem.mcrt, mcrtItem.item_id)
    }

    @ResolveField(() => Number)
    async qty_on_queue(@Parent() mcrtItem: MCRTItem): Promise<number> {

        return await this.mcrtItemService.get_qty_on_queue(mcrtItem.mcrt, mcrtItem.item_id)
    }
  
}
