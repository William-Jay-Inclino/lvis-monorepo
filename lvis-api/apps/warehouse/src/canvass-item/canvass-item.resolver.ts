import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CanvassItemService } from './canvass-item.service';
import { CanvassItem } from './entities/canvass-item.entity';
import { CreateCanvassItemInput } from './dto/create-canvass-item.input';
import { UpdateCanvassItemInput } from './dto/update-canvass-item.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => CanvassItem)
export class CanvassItemResolver {

    private readonly logger = new Logger(CanvassItemResolver.name);
    private filename = 'canvass-item.resolver.ts'

  constructor(private readonly canvassItemService: CanvassItemService) { }

  @Mutation(() => CanvassItem)
  async createCanvassItem(
    @Args('input') createCanvassItemInput: CreateCanvassItemInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'createCanvassItem',
        input: JSON.stringify(createCanvassItemInput)
      })
      
      this.canvassItemService.setAuthUser(authUser)

      const x = await this.canvassItemService.create(createCanvassItemInput);
      
      this.logger.log('Canvass Item created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in canvass Item', error)
    }
    
  }

  @Query(() => CanvassItem)
  canvass_item(@Args('id') id: string) {
    return this.canvassItemService.findOne(id);
  }

  @Mutation(() => CanvassItem)
  async updateCanvassItem(
    @Args('id') id: string,
    @Args('input') updateCanvassItemInput: UpdateCanvassItemInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'updateCanvassItem',
        canvass_item_id: id,
        input: JSON.stringify(updateCanvassItemInput),
      })
      
      this.canvassItemService.setAuthUser(authUser)
      const x = await this.canvassItemService.update(id, updateCanvassItemInput);

      this.logger.log('Canvass Item updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating canvass item', error)
    }

  }

  @Mutation(() => WarehouseRemoveResponse)
  async removeCanvassItem(
    @Args('id', { type: () => String }) id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    
    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'removeCanvassItem',
        canvass_item_id: id,
      })

      this.canvassItemService.setAuthUser(authUser)
      const x = await this.canvassItemService.remove(id);
      
      this.logger.log('Canvass Item removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing canvass Item', error)
    }

  }

}
