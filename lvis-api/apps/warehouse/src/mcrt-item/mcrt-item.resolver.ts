import { Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { McrtItemService } from './mcrt-item.service';
import { MCRTItem } from './entities/mcrt-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { CreateMcrtItemSubInput } from '../mcrt/dto/create-mcrt-item.sub.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MCRTItem)
export class McrtItemResolver {

    constructor(private readonly mcrtItemService: McrtItemService) {}

    @Mutation(() => [MCRTItem])
    async updateMcrtItems(
        @Args('mcrt_id') mcrt_id: string,
        @Args({ name: 'items', type: () => [CreateMcrtItemSubInput] }) items: CreateMcrtItemSubInput[],
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mcrtItemService.setAuthUser(authUser)
        return await this.mcrtItemService.updateMcrtItems(mcrt_id, items);
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
