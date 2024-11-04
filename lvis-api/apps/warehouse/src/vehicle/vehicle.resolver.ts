import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { TripTicket } from '../trip-ticket/entities/trip-ticket.entity';
import { Employee } from '../__employee__/entities/employee.entity';
import { GasSlipService } from '../gas-slip/gas-slip.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly gasSlipService: GasSlipService,
  ) { }

  @Mutation(() => Vehicle)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.VEHICLE, RESOLVERS.createVehicle)
  createVehicle(
    @Args('input') createVehicleInput: CreateVehicleInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.vehicleService.setAuthUser(authUser)
    return this.vehicleService.create(createVehicleInput);
  }

  @Query(() => [Vehicle])
  vehicles() {
    return this.vehicleService.findAll();
  }

  @Query(() => Vehicle)
  vehicle(@Args('id') id: string) {
    return this.vehicleService.findOne(id);
  }

  @Mutation(() => Vehicle)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.VEHICLE, RESOLVERS.updateVehicle)
  updateVehicle(
    @Args('id') id: string,
    @Args('input') updateVehicleInput: UpdateVehicleInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.vehicleService.setAuthUser(authUser)
    return this.vehicleService.update(id, updateVehicleInput);
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.VEHICLE, RESOLVERS.removeVehicle)
  removeVehicle(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.vehicleService.setAuthUser(authUser)
    return this.vehicleService.remove(id);
  }

  @ResolveField(() => Employee)
  assignee(@Parent() vehicle: Vehicle): any {
    console.log('assignee', vehicle);
    return { __typename: 'Employee', id: vehicle.assignee_id }
  }

  @ResolveField(() => Number)
  async total_unposted_gas_slips(@Parent() vehicle: Vehicle) {
    return await this.gasSlipService.get_total_unposted_gas_slips(vehicle.id)
  }

}
