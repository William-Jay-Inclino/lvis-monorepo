import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MrvItemService } from './mrv-item.service';
import { MRVItem } from './entities/mrv-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { CreateMrvItemSubInput } from '../mrv/dto/create-mrv-item.sub.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => MRVItem)
export class MrvItemResolver {

    constructor(private readonly mrvItemService: MrvItemService) {}

    @Mutation(() => [MRVItem])
    async updateMrvItems(
        @Args('mrv_id') mrv_id: string,
        @Args({ name: 'items', type: () => [CreateMrvItemSubInput] }) items: CreateMrvItemSubInput[],
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mrvItemService.setAuthUser(authUser)
        return await this.mrvItemService.updateMrvItems(mrv_id, items);
    }
  
}
