import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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

@UseGuards(GqlAuthGuard)
@Resolver(() => GasSlip)
export class GasSlipResolver {
  constructor(private readonly tripTicketService: GasSlipService) { }

  @Mutation(() => GasSlip)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.GAS_SLIP, RESOLVERS.createGasSlip)
  createGasSlip(
    @Args('input') createGasSlipInput: CreateGasSlipInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.tripTicketService.setAuthUser(authUser)
    return this.tripTicketService.create(createGasSlipInput);
  }

  @Query(() => [GasSlip])
  gas_slips() {
    return this.tripTicketService.findAll();
  }

  @Query(() => GasSlip)
  gas_slip(@Args('id') id: string) {
    return this.tripTicketService.findOne(id);
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.GAS_SLIP, RESOLVERS.removeGasSlip)
  removeGasSlip(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.tripTicketService.setAuthUser(authUser)
    return this.tripTicketService.remove(id);
  }
}
