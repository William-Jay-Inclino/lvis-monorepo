import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FuelTypeService } from './fuel-type.service';
import { FuelType } from './entities/fuel-type.entity';
import { CreateFuelTypeInput } from './dto/create-fuel-type.input';
import { UpdateFuelTypeInput } from './dto/update-fuel-type.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => FuelType)
export class FuelTypeResolver {
  constructor(private readonly fuelTypeService: FuelTypeService) { }

  @Mutation(() => FuelType)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.FUEL_TYPE, RESOLVERS.createFuelType)
  createFuelType(
    @Args('input') createFuelTypeInput: CreateFuelTypeInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    return this.fuelTypeService.create(createFuelTypeInput);
  }

  @Query(() => [FuelType])
  fuel_types() {
    return this.fuelTypeService.findAll();
  }

  @Query(() => FuelType)
  fuel_type(@Args('id') id: number) {
    return this.fuelTypeService.findOne(id);
  }

  @Mutation(() => FuelType)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.FUEL_TYPE, RESOLVERS.updateFuelType)
  updateFuelType(
    @Args('id') id: number,
    @Args('input') updateFuelTypeInput: UpdateFuelTypeInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    return this.fuelTypeService.update(id, updateFuelTypeInput);
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.FUEL_TYPE, RESOLVERS.removeFuelType)
  removeFuelType(
    @Args('id') id: number,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    return this.fuelTypeService.remove(id);
  }
}
