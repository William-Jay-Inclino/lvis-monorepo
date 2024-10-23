import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StationService } from './station.service';
import { Station } from './entities/station.entity';
import { CreateStationInput } from './dto/create-station.input';
import { UpdateStationInput } from './dto/update-station.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';

@UseGuards(GqlAuthGuard)
@Resolver(() => Station)
export class StationResolver {
  constructor(private readonly stationService: StationService) { }

  @Mutation(() => Station)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.STATION, RESOLVERS.createStation)
  createStation(
    @Args('input') createStationInput: CreateStationInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.stationService.setAuthUser(authUser)
    return this.stationService.create(createStationInput);
  }

  @Query(() => [Station])
  stations() {
    return this.stationService.findAll();
  }

  @Query(() => Station)
  station(@Args('id') id: string) {
    return this.stationService.findOne(id);
  }

  @Mutation(() => Station)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.STATION, RESOLVERS.updateStation)
  updateStation(
    @Args('id') id: string,
    @Args('input') updateStationInput: UpdateStationInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.stationService.setAuthUser(authUser)
    return this.stationService.update(id, updateStationInput);
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.STATION, RESOLVERS.removeStation)
  removeStation(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.stationService.setAuthUser(authUser)
    return this.stationService.remove(id);
  }
}
