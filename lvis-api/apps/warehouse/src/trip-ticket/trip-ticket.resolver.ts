import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TripTicketService } from './trip-ticket.service';
import { TripTicket } from './entities/trip-ticket.entity';
import { CreateTripTicketInput } from './dto/create-trip-ticket.input';
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
@Resolver(() => TripTicket)
export class TripTicketResolver {
  constructor(private readonly tripTicketService: TripTicketService) { }

  @Mutation(() => TripTicket)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.TRIP_TICKET, RESOLVERS.createTripTicket)
  createTripTicket(
    @Args('input') createTripTicketInput: CreateTripTicketInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.tripTicketService.setAuthUser(authUser)
    return this.tripTicketService.create(createTripTicketInput);
  }

  @Query(() => [TripTicket])
  trip_tickets() {
    return this.tripTicketService.findAll();
  }

  @Query(() => TripTicket)
  trip_ticket(@Args('id') id: string) {
    return this.tripTicketService.findOne(id);
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.TRIP_TICKET, RESOLVERS.removeTripTicket)
  removeTripTicket(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.tripTicketService.setAuthUser(authUser)
    return this.tripTicketService.remove(id);
  }
}
