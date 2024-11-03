import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int } from '@nestjs/graphql';
import { GasSlipService } from './gas-slip.service';
import { GasSlip } from './entities/gas-slip.entity';
import { CreateGasSlipInput } from './dto/create-gas-slip.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { GasSlipsResponse } from './entities/gas-slips-response.entity';
import { Employee } from '../__employee__/entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => GasSlip)
export class GasSlipResolver {
  constructor(private readonly gasSlipService: GasSlipService) { }

  @Mutation(() => GasSlip)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.GAS_SLIP, RESOLVERS.createGasSlip)
  createGasSlip(
    @Args('input') createGasSlipInput: CreateGasSlipInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.gasSlipService.setAuthUser(authUser)
    return this.gasSlipService.create(createGasSlipInput);
  }

  @Query(() => GasSlipsResponse)
  async gas_slips(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
    @Args('vehicle_id', { type: () => String, nullable: true }) vehicle_id?: string,
  ): Promise<GasSlipsResponse> {
    return this.gasSlipService.findAll(page, pageSize, vehicle_id);
  }

  @Query(() => GasSlip)
  gas_slip(@Args('id') id: string) {
    return this.gasSlipService.findOne(id);
  }

  @ResolveField(() => Employee)
  driver(@Parent() gasSlip: GasSlip): any {
      return { __typename: 'Employee', id: gasSlip.driver_id }
  }

  @ResolveField(() => Employee)
  requested_by(@Parent() gasSlip: GasSlip): any {
      return { __typename: 'Employee', id: gasSlip.requested_by_id }
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.GAS_SLIP, RESOLVERS.removeGasSlip)
  removeGasSlip(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.gasSlipService.setAuthUser(authUser)
    return this.gasSlipService.remove(id);
  }

  @ResolveField(() => Number)
  async total_unposted_gas_slip(@Parent() gasSlip: GasSlip) {
    return await this.gasSlipService.get_total_unposted_gas_slips(gasSlip.requested_by_id)
  }
  
}
