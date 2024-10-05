import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MstItemService } from './mst-item.service';
import { MSTItem } from './entities/mst-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { CreateMstItemSubInput } from '../mst/dto/create-mst-item.sub.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => MSTItem)
export class MstItemResolver {

    constructor(private readonly mstItemService: MstItemService) {}

    @Mutation(() => [MSTItem])
    async updateMstItems(
        @Args('mst_id') mst_id: string,
        @Args({ name: 'items', type: () => [CreateMstItemSubInput] }) items: CreateMstItemSubInput[],
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mstItemService.setAuthUser(authUser)
        return await this.mstItemService.updateMstItems(mst_id, items);
    }
  
}
