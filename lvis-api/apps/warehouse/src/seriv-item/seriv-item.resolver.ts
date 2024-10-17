import { Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { SerivItemService } from './seriv-item.service';
import { SERIVItem } from './entities/seriv-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { CreateSerivItemSubInput } from '../seriv/dto/create-seriv-item.sub.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => SERIVItem)
export class SerivItemResolver {

    constructor(
        private readonly serivItemService: SerivItemService,
    ) {}

    @Mutation(() => [SERIVItem])
    async updateSerivItems(
        @Args('seriv_id') seriv_id: string,
        @Args({ name: 'items', type: () => [CreateSerivItemSubInput] }) items: CreateSerivItemSubInput[],
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.serivItemService.setAuthUser(authUser)
        return await this.serivItemService.updateSerivItems(seriv_id, items);
    }

    @ResolveField(() => Number)
    qty_returned(@Parent() serivItem: SERIVItem): number {
        console.log('__serivItem', serivItem);
        return this.serivItemService.get_qty_returned(serivItem.seriv.mcrts, serivItem.item_id)
    }

    @ResolveField(() => Number)
    async qty_on_queue(@Parent() serivItem: SERIVItem): Promise<number> {

        return await this.serivItemService.get_qty_on_queue(serivItem.seriv.mcrts, serivItem.item_id)
    }
  
}
