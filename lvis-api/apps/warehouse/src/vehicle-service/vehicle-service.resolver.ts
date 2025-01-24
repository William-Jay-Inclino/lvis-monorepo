import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VehicleServiceService } from './vehicle-service.service';
import { VehicleService } from './entities/vehicle-service.entity';
import { CreateVehicleServiceInput } from './dto/create-vehicle-service.input';
import { UpdateVehicleServiceInput } from './dto/update-vehicle-service.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => VehicleService)
export class VehicleServiceResolver {
  constructor(
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly audit: WarehouseAuditService,
  ) { }

  @Mutation(() => VehicleService)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.VEHICLE_SERVICE, RESOLVERS.createVehicleService)
  createVehicleService(
    @Args('input') createVehicleServiceInput: CreateVehicleServiceInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {
    this.vehicleServiceService.setAuthUser(authUser)
    return this.vehicleServiceService.create(createVehicleServiceInput, {
      ip_address,
      device_info: this.audit.getDeviceInfo(user_agent)
    });
  }

  @Query(() => [VehicleService])
  vehicle_services() {
    return this.vehicleServiceService.findAll();
  }

  @Query(() => VehicleService)
  vehicle_service(@Args('id') id: string) {
    return this.vehicleServiceService.findOne(id);
  }

  @Mutation(() => VehicleService)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.VEHICLE_SERVICE, RESOLVERS.updateVehicleService)
  updateVehicleService(
    @Args('id') id: string,
    @Args('input') updateVehicleServiceInput: UpdateVehicleServiceInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {
    this.vehicleServiceService.setAuthUser(authUser)
    return this.vehicleServiceService.update(id, updateVehicleServiceInput, {
      ip_address,
      device_info: this.audit.getDeviceInfo(user_agent)
    });
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.VEHICLE_SERVICE, RESOLVERS.removeVehicleService)
  removeVehicleService(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {
    this.vehicleServiceService.setAuthUser(authUser)
    return this.vehicleServiceService.remove(id, {
      ip_address,
      device_info: this.audit.getDeviceInfo(user_agent)
    });
  }
}
