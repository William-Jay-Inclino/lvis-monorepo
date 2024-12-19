import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ServiceCenterService } from './service-center.service';
import { ServiceCenter } from './entities/service-center.entity';
import { CreateServiceCenterInput } from './dto/create-service-center.input';
import { UpdateServiceCenterInput } from './dto/update-service-center.input';
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
@Resolver(() => ServiceCenter)
export class ServiceCenterResolver {
  constructor(private readonly serviceCenterService: ServiceCenterService) { }

  @Mutation(() => ServiceCenter)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.SERVICE_CENTER, RESOLVERS.createServiceCenter)
  createServiceCenter(
    @Args('input') createServiceCenterInput: CreateServiceCenterInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.serviceCenterService.setAuthUser(authUser)
    return this.serviceCenterService.create(createServiceCenterInput);
  }

  @Query(() => [ServiceCenter])
  service_centers() {
    return this.serviceCenterService.findAll();
  }

  @Query(() => ServiceCenter)
  service_center(@Args('id') id: string) {
    return this.serviceCenterService.findOne(id);
  }

  @Mutation(() => ServiceCenter)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.SERVICE_CENTER, RESOLVERS.updateServiceCenter)
  updateServiceCenter(
    @Args('id') id: string,
    @Args('input') updateServiceCenterInput: UpdateServiceCenterInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.serviceCenterService.setAuthUser(authUser)
    return this.serviceCenterService.update(id, updateServiceCenterInput);
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.SERVICE_CENTER, RESOLVERS.removeServiceCenter)
  removeServiceCenter(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.serviceCenterService.setAuthUser(authUser)
    return this.serviceCenterService.remove(id);
  }
}
