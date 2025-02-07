import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GasStationService } from './gas-station.service';
import { GasStation } from './entities/gas-station.entity';
import { CreateGasStationInput } from './dto/create-gas-station.input';
import { UpdateGasStationInput } from './dto/update-gas-station.input';
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
@Resolver(() => GasStation)
export class GasStationResolver {
  constructor(private readonly gasStationService: GasStationService) { }

  @Mutation(() => GasStation)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.GAS_STATION, RESOLVERS.createGasStation)
  createGasStation(
    @Args('input') createGasStationInput: CreateGasStationInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    return this.gasStationService.create(createGasStationInput);
  }

  @Query(() => [GasStation])
  gas_stations() {
    return this.gasStationService.findAll();
  }

  @Query(() => GasStation)
  gas_station(@Args('id') id: number) {
    return this.gasStationService.findOne(id);
  }

  @Mutation(() => GasStation)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.GAS_STATION, RESOLVERS.updateGasStation)
  updateGasStation(
    @Args('id') id: number,
    @Args('input') updateGasStationInput: UpdateGasStationInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    return this.gasStationService.update(id, updateGasStationInput);
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.GAS_STATION, RESOLVERS.removeGasStation)
  removeGasStation(
    @Args('id') id: number,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    return this.gasStationService.remove(id);
  }
}
