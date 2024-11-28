import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { OsrivItemService } from './osriv-item.service';
import { OSRIVItem } from './entities/osriv-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { CreateOsrivItemSubInput } from '../osriv/dto/create-osriv-item.sub.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => OSRIVItem)
export class OsrivItemResolver {

    private readonly logger = new Logger(OsrivItemResolver.name);
    private filename = 'osriv-item.resolver.ts'

    constructor(private readonly osrivItemService: OsrivItemService) {}

    @Mutation(() => [OSRIVItem])
    async updateOsrivItems(
        @Args('osriv_id') osriv_id: string,
        @Args({ name: 'items', type: () => [CreateOsrivItemSubInput] }) items: CreateOsrivItemSubInput[],
        @CurrentAuthUser() authUser: AuthUser
    ) {

        try {
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: 'updateMrvItems',
              osriv_id,
              items: JSON.stringify(items)
            })
            
            this.osrivItemService.setAuthUser(authUser)
      
            const x = await this.osrivItemService.updateOsrivItems(osriv_id, items);
            
            this.logger.log('OSRIV Items updated successfully')
      
            return x
      
        } catch (error) {
            this.logger.error('Error in updating OSRIVMRV Items', error)
        }

    }
  
}
