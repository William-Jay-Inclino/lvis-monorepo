import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { Employee } from '../__employee__/entities/employee.entity';
import { GasSlipService } from '../gas-slip/gas-slip.service';
import { UpdateVehicleResponse } from './entities/update-vehicle-response.entity';
import { VehiclesResponse } from './entities/vehicles-response.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => Vehicle)
export class VehicleResolver {

  private readonly logger = new Logger(VehicleResolver.name);
  private filename = 'vehicle.resolver.ts'

  constructor(
    private readonly vehicleService: VehicleService,
    private readonly gasSlipService: GasSlipService,
  ) { }

  @Mutation(() => Vehicle)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.VEHICLE, RESOLVERS.createVehicle)
  async createVehicle(
    @Args('input') createVehicleInput: CreateVehicleInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.createVehicle,
        input: JSON.stringify(createVehicleInput)
      })
      
      this.vehicleService.setAuthUser(authUser)

      const x = await this.vehicleService.create(createVehicleInput);
      
      this.logger.log('Vehicle created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating Vehicle', error)
    }
  }

  @Query(() => VehiclesResponse)
  vehicles(
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
    @Args('assignee_id', { nullable: true }) assignee_id?: string,
  ) {
    return this.vehicleService.findAll(page, pageSize, assignee_id);
  }

  @Query(() => Vehicle)
  async vehicle(
    @Args('id', { nullable: true }) id?: string,
    @Args('vehicle_number', { nullable: true }) vehicle_number?: string
  ) {
    if (id) {
      return this.vehicleService.findOne(id);
    }
    if (vehicle_number) {
      return this.vehicleService.findByVehicleNumber(vehicle_number)
    }
  }

  @Query(() => [Vehicle])
  vehiclesByName(
    @Args('input') input: string,
  ) {
    return this.vehicleService.findVehiclesByName(input)
  }

  @Mutation(() => UpdateVehicleResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.VEHICLE, RESOLVERS.updateVehicle)
  async updateVehicle(
    @Args('id') id: string,
    @Args('input') updateVehicleInput: UpdateVehicleInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.updateVehicle,
        vehicle_id: id,
        input: JSON.stringify(updateVehicleInput),
      })
      
      this.vehicleService.setAuthUser(authUser)
      const x = await this.vehicleService.update(id, updateVehicleInput);

      this.logger.log('Vehicle updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating Vehicle', error)
    }
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.VEHICLE, RESOLVERS.removeVehicle)
  async removeVehicle(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.removeVehicle,
        vehicle_id: id,
      })

      this.vehicleService.setAuthUser(authUser)
      const x = await this.vehicleService.remove(id);
      
      this.logger.log('Vehicle removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing Vehicle', error)
    }
  }

  @ResolveField(() => Employee)
  assignee(@Parent() vehicle: Vehicle): any {
    return { __typename: 'Employee', id: vehicle.assignee_id }
  }

  @ResolveField(() => Number)
  async total_unposted_gas_slips(@Parent() vehicle: Vehicle) {
    return await this.gasSlipService.get_total_unposted_gas_slips(vehicle.id)
  }

}
