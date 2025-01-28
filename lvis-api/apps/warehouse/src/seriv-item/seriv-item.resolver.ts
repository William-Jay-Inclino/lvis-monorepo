import { Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { SerivItemService } from './seriv-item.service';
import { SERIVItem } from './entities/seriv-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { CreateSerivItemSubInput } from '../seriv/dto/create-seriv-item.sub.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { SERIV } from '../seriv/entities/seriv.entity';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => SERIVItem)
export class SerivItemResolver {

    private readonly logger = new Logger(SerivItemResolver.name);
    private filename = 'seriv-item.resolver.ts'

    constructor(
        private readonly serivItemService: SerivItemService,
        private readonly audit: WarehouseAuditService,
    ) {}

    @Mutation(() => SERIV)
    async updateSerivItems(
        @Args('seriv_id') seriv_id: string,
        @Args({ name: 'items', type: () => [CreateSerivItemSubInput] }) items: CreateSerivItemSubInput[],
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        this.logger.log('Updating SERIV items...', {
          username: authUser.user.username,
          filename: this.filename,
          seriv_id,
          items: JSON.stringify(items)
        })
        try {
            
            this.serivItemService.setAuthUser(authUser)
      
            const x = await this.serivItemService.updateSerivItems(seriv_id, items, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            });
            
            this.logger.log('SERIV Items updated successfully')
      
            return x
      
        } catch (error) {
            this.logger.error('Error in updating SERIV Items', error)
        }
    }

    @ResolveField(() => Number)
    qty_returned(@Parent() serivItem: SERIVItem): number {
        return this.serivItemService.get_qty_returned(serivItem.seriv.mcrts, serivItem.item_id)
    }

    @ResolveField(() => Number)
    async qty_on_queue(@Parent() serivItem: SERIVItem): Promise<number> {

        return await this.serivItemService.get_qty_on_queue(serivItem.seriv.mcrts, serivItem.item_id)
    }
  
}
