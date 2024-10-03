import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { OsrivItemService } from './osriv-item.service';
import { OSRIVItem } from './entities/osriv-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { CreateOsrivItemSubInput } from '../osriv/dto/create-osriv-item.sub.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => OSRIVItem)
export class OsrivItemResolver {

    constructor(private readonly osrivItemService: OsrivItemService) {}

    @Mutation(() => [OSRIVItem])
    async updateOsrivItems(
        @Args('osriv_id') osriv_id: string,
        @Args({ name: 'items', type: () => [CreateOsrivItemSubInput] }) items: CreateOsrivItemSubInput[],
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.osrivItemService.setAuthUser(authUser)
        return await this.osrivItemService.updateOsrivItems(osriv_id, items);
    }
  
}
