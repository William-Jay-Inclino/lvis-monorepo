import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { McrtItemService } from './mcrt-item.service';
import { MCRTItem } from './entities/mcrt-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { CreateMcrtItemSubInput } from '../mcrt/dto/create-mcrt-item.sub.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';

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
  
}
