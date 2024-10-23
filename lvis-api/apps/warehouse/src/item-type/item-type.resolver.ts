import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ItemTypeService } from './item-type.service';
import { ItemType } from './entities/item-type.entity';
import { CreateItemTypeInput } from './dto/create-item-type.input';
import { UpdateItemTypeInput } from './dto/update-item-type.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { MODULES } from 'apps/system/src/__common__/modules.enum';

@UseGuards(GqlAuthGuard)
@Resolver(() => ItemType)
export class ItemTypeResolver {
  constructor(private readonly itemTypeService: ItemTypeService) { }

  @Mutation(() => ItemType)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.ITEM_TYPE, RESOLVERS.createItemType)
  createItemType(
    @Args('input') createItemTypeInput: CreateItemTypeInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.itemTypeService.setAuthUser(authUser)
    return this.itemTypeService.create(createItemTypeInput);
  }

  @Query(() => [ItemType])
  item_types() {
    return this.itemTypeService.findAll();
  }

  @Query(() => ItemType)
  item_type(@Args('id') id: number) {
    return this.itemTypeService.findOne(id);
  }

  @Mutation(() => ItemType)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.ITEM_TYPE, RESOLVERS.updateItemType)
  updateItemType(
    @Args('id') id: number,
    @Args('input') updateItemTypeInput: UpdateItemTypeInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.itemTypeService.setAuthUser(authUser)
    return this.itemTypeService.update(id, updateItemTypeInput);
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.STATION, RESOLVERS.removeStation)
  removeItemType(
    @Args('id') id: number,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.itemTypeService.setAuthUser(authUser)
    return this.itemTypeService.remove(id);
  }
}
