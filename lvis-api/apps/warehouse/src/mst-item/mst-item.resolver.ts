import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MstItemService } from './mst-item.service';
import { MSTItem } from './entities/mst-item.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { CreateMstItemSubInput } from '../mst/dto/create-mst-item.sub.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MSTItem)
export class MstItemResolver {

    private readonly logger = new Logger(MstItemResolver.name);
    private filename = 'mst-item.resolver.ts'

    constructor(private readonly mstItemService: MstItemService) {}

    @Mutation(() => [MSTItem])
    async updateMstItems(
        @Args('mst_id') mst_id: string,
        @Args({ name: 'items', type: () => [CreateMstItemSubInput] }) items: CreateMstItemSubInput[],
        @CurrentAuthUser() authUser: AuthUser
    ) {

        try {
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: 'updateMrvItems',
              mst_id,
              items: JSON.stringify(items)
            })
            
            this.mstItemService.setAuthUser(authUser)
      
            const x = await this.mstItemService.updateMstItems(mst_id, items);
            
            this.logger.log('MST Items updated successfully')
      
            return x
      
        } catch (error) {
            this.logger.error('Error in updating MST Items', error)
        }

    }
  
}
