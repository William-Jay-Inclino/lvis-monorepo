import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { ItemsResponse } from './entities/items-response.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { ITEM_TYPE_CODE } from '../__common__/constants';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';

@UseGuards(GqlAuthGuard)
@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) { }

  @Mutation(() => Item)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.ITEM, RESOLVERS.createItem)
  createItem(
    @Args('input') createItemInput: CreateItemInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.itemService.setAuthUser(authUser)
    return this.itemService.create(createItemInput);
  }

  @Query(() => ItemsResponse)
  items(
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
    @Args('description', { nullable: true }) description?: string,
    @Args('item_codes', { nullable: true }) item_codes?: string,
  ) {
    
    let _item_codes = []
    
    if(item_codes) {
      _item_codes = item_codes.split(',');
    }

    return this.itemService.findAll(page, pageSize, description, _item_codes as ITEM_TYPE_CODE[]);
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
  updateItem(
    @Args('id') id: string,
    @Args('input') updateItemInput: UpdateItemInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.itemService.setAuthUser(authUser)
    return this.itemService.update(id, updateItemInput);
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.ITEM, RESOLVERS.removeItem)
  removeItem(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.itemService.setAuthUser(authUser)
    return this.itemService.remove(id);
  }

  @ResolveField(() => Number)
  GWAPrice(@Parent() item: Item) {
    return this.itemService.getGWAPrice(item.item_transactions)
  }

}
