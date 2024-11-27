import { Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { MrvItemService } from './mrv-item.service';
import { MRVItem } from './entities/mrv-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { CreateMrvItemSubInput } from '../mrv/dto/create-mrv-item.sub.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { SerivItemService } from '../seriv-item/seriv-item.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MRVItem)
export class MrvItemResolver {

    constructor(
        private readonly mrvItemService: MrvItemService,
        private readonly serivItemService: SerivItemService,
    ) {}

    @Mutation(() => [MRVItem])
    async updateMrvItems(
        @Args('mrv_id') mrv_id: string,
        @Args({ name: 'items', type: () => [CreateMrvItemSubInput] }) items: CreateMrvItemSubInput[],
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mrvItemService.setAuthUser(authUser)
        return await this.mrvItemService.updateMrvItems(mrv_id, items);
    }

    @ResolveField(() => Number)
    qty_returned(@Parent() mrvItem: MRVItem): number {
        return this.serivItemService.get_qty_returned(mrvItem.mrv.mct.mcrts, mrvItem.item_id)
    }

    @ResolveField(() => Number)
    async qty_on_queue(@Parent() mrvItem: MRVItem): Promise<number> {
        return await this.serivItemService.get_qty_on_queue(mrvItem.mrv.mct.mcrts, mrvItem.item_id)
    }
  
}
