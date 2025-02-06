import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { ItemsResponse } from './entities/items-response.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { ITEM_TYPE_CODE } from '../__common__/constants';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => Item)
export class ItemResolver {

    private readonly logger = new Logger(ItemResolver.name);
    private filename = 'item.resolver.ts'

  constructor(
    private readonly itemService: ItemService,
    private readonly audit: WarehouseAuditService,
  ) { }

  @Mutation(() => Item)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.ITEM, RESOLVERS.createItem)
  async createItem(
    @Args('input') createItemInput: CreateItemInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {
    this.logger.log('Creating item...', {
      username: authUser.user.username,
      filename: this.filename,
      input: JSON.stringify(createItemInput)
    })
    
    try {

      const x = await this.itemService.create(createItemInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser
      });
      
      this.logger.log('Item created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating item', error)
    }
  }

  @Query(() => ItemsResponse)
  items(
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
    @Args('description', { nullable: true }) description?: string,
    @Args('item_codes', { nullable: true }) item_codes?: string,
    @Args('project_id', { nullable: true }) project_id?: string,
  ) {
    
    let _item_codes = []
    
    if(item_codes) {
      _item_codes = item_codes.split(',');
    }

    return this.itemService.findAll(page, pageSize, description, _item_codes as ITEM_TYPE_CODE[], project_id);
  }

  @Query(() => Item)
  item(
    @Args('id', { nullable: true }) id?: string,
    @Args('code', { nullable: true }) code?: string,
  ) {
    if (id) {
      return this.itemService.findOne(id);
    }
    if (code) {
      return this.itemService.findByCode(code)
    }
  }

  @Query(() => [Item])
  itemsByCode(
    @Args('input') input: string,
  ) {
    return this.itemService.findItemsByCode(input)
  }

  @Mutation(() => Item)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.ITEM, RESOLVERS.updateItem)
  async updateItem(
    @Args('id') id: string,
    @Args('input') updateItemInput: UpdateItemInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Updating item...', {
      username: authUser.user.username,
      filename: this.filename,
      item_id: id,
      input: JSON.stringify(updateItemInput),
    })

    try {
      const x = await this.itemService.update(id, updateItemInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser
      });

      this.logger.log('Item updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating item', error)
    }

  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.ITEM, RESOLVERS.removeItem)
  async removeItem(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Removing item...', {
      username: authUser.user.username,
      filename: this.filename,
      item_id: id,
    })

    try {
      const x = await this.itemService.remove(id, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser
      });
      
      this.logger.log('Item removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing item', error)
    }
  }

  @ResolveField(() => Number)
  GWAPrice(@Parent() item: Item) {
    return this.itemService.getGWAPrice(item.item_transactions)
  }

}
