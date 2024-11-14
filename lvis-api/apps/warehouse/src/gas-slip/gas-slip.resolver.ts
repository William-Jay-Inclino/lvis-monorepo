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
import { APPROVAL_STATUS } from '../__common__/types';
import { GasSlipApproverService } from '../gas-slip-approver/gas-slip-approver.service';
import { GasSlipApprover } from '../gas-slip-approver/entities/gas-slip-approver.entity';
import { PostGasSlipInput } from './dto/post-gas-slip.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => GasSlip)
export class GasSlipResolver {
  constructor(
    private readonly gasSlipService: GasSlipService,
    private readonly gasSlipApproverService: GasSlipApproverService,
  ) { }

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

  @Mutation(() => GasSlip)
  @UseGuards(AccessGuard)
  postGasSlip(
    @Args('id') id: string,
    @Args('input') input: PostGasSlipInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.gasSlipService.setAuthUser(authUser)
    return this.gasSlipService.post_gas_slip(id, input);
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
  async gas_slip(
      @Args('id', { nullable: true }) id?: string,
      @Args('gas_slip_number', { nullable: true }) gas_slip_number?: string,
  ) {
    if (!id && !gas_slip_number) {
        throw new Error('Either id or gas_slip_number must be provided');
    }
    return this.gasSlipService.findOne({ id, gas_slip_number });
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

  @ResolveField(() => [GasSlipApprover])
    gas_slip_approvers(@Parent() gasSlip: GasSlip): any {
      return this.gasSlipApproverService.findByGasSlipId(gasSlip.id)
  }

  @ResolveField(() => Int)
  async status(@Parent() gasSlip: GasSlip) {

    if (gasSlip.cancelled_at) {
        return APPROVAL_STATUS.CANCELLED
    }

    return await this.gasSlipService.getStatus(gasSlip.id)

  }

  @ResolveField(() => Boolean)
  can_update(
    @Parent() gasSlip: GasSlip,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.gasSlipService.setAuthUser(authUser)
    return this.gasSlipService.canUpdateForm(gasSlip.id)
  }

  @ResolveField(() => Boolean)
  can_print(
    @Parent() gasSlip: GasSlip,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.gasSlipService.setAuthUser(authUser)
    return this.gasSlipService.canPrint(gasSlip.id)
  }

  @ResolveField(() => Boolean)
  can_post(
    @Parent() gasSlip: GasSlip,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.gasSlipService.setAuthUser(authUser)
    return this.gasSlipService.canPostGasSlip(gasSlip.id)
  }
  
}
