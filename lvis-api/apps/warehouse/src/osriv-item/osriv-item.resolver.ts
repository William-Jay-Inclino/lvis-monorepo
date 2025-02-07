import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { OsrivItemService } from './osriv-item.service';
import { OSRIVItem } from './entities/osriv-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { CreateOsrivItemSubInput } from '../osriv/dto/create-osriv-item.sub.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { OSRIV } from '../osriv/entities/osriv.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => OSRIVItem)
export class OsrivItemResolver {

    private readonly logger = new Logger(OsrivItemResolver.name);
    private filename = 'osriv-item.resolver.ts'

    constructor(
        private readonly osrivItemService: OsrivItemService,
        private readonly audit: WarehouseAuditService,
    ) {}

    @Mutation(() => OSRIV)
    async updateOsrivItems(
        @Args('osriv_id') osriv_id: string,
        @Args({ name: 'items', type: () => [CreateOsrivItemSubInput] }) items: CreateOsrivItemSubInput[],
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Updating OSRIV items...', {
          username: authUser.user.username,
          filename: this.filename,
          osriv_id,
          items: JSON.stringify(items)
        })

        try {
            
            const x = await this.osrivItemService.updateOsrivItems(osriv_id, items, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
            
            this.logger.log('OSRIV Items updated successfully')
      
            return x
      
        } catch (error) {
            this.logger.error('Error in updating OSRIVMRV Items', error)
        }

    }
  
}
