import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
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
import { TripTicketsResponse } from './entities/trip-tickets-response.entity';
import { Employee } from '../__employee__/entities/employee.entity';
import { TripTicketApprover } from '../trip-ticket-approver/entities/trip-ticket-approver.entity';
import { TripTicketApproverService } from '../trip-ticket-approver/trip-ticket-approver.service';
import { UpdateActualTimeResponse } from './entities/update-actual-time-response.entity';
import { UpdateActualTimeInput } from './dto/update-actual-time.input';
import { UpdateActualStartTimeInput } from './dto/update-actual-start-time.input';
import { UpdateActualEndTimeInput } from './dto/update-actual-end-time.input';

// @UseGuards(GqlAuthGuard)
@Resolver(() => TripTicket)
export class TripTicketResolver {
  constructor(
    private readonly tripTicketService: TripTicketService,
    private readonly tripTicketApproverService: TripTicketApproverService,
  ) { }

  @Mutation(() => TripTicket)
  @UseGuards(GqlAuthGuard, AccessGuard)
  @CheckAccess(MODULES.TRIP_TICKET, RESOLVERS.createTripTicket)
  createTripTicket(
    @Args('input') createTripTicketInput: CreateTripTicketInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.tripTicketService.setAuthUser(authUser)
    return this.tripTicketService.create(createTripTicketInput);
  }

  @Query(() => TripTicketsResponse)
  @UseGuards(GqlAuthGuard)
  async trip_tickets(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
    @Args('vehicle_id', { type: () => String, nullable: true }) vehicle_id?: string,
    @Args('driver_id', { type: () => String, nullable: true }) driver_id?: string,
    @Args('date_prepared', { type: () => String, nullable: true }) date_prepared?: string,
    @Args('estimated_departure', { type: () => String, nullable: true }) estimated_departure?: string,
  ): Promise<TripTicketsResponse> {
    return this.tripTicketService.findAll(page, pageSize, vehicle_id, driver_id, date_prepared, estimated_departure);
  }

  @Query(() => TripTicket)
  @UseGuards(GqlAuthGuard)
  trip_ticket(
    @Args('id', { nullable: true }) id?: string,
    @Args('trip_number', { nullable: true }) trip_number?: string,
  ) {
    if (!id && !trip_number) {
      throw new Error('Either id or trip_number must be provided');
  }
    return this.tripTicketService.findOne({ id, trip_number });
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(GqlAuthGuard, AccessGuard)
  @CheckAccess(MODULES.TRIP_TICKET, RESOLVERS.removeTripTicket)
  removeTripTicket(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.tripTicketService.setAuthUser(authUser)
    return this.tripTicketService.remove(id);
  }

  @Mutation(() => UpdateActualTimeResponse)
  async updateActualTime(
    @Args('input') input: UpdateActualTimeInput,
  ): Promise<UpdateActualTimeResponse> {

    return await this.tripTicketService.update_actual_time(input.rf_id);

  }

  @Mutation(() => UpdateActualTimeResponse)
  @UseGuards(GqlAuthGuard, AccessGuard)
  removeActualStartTime(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.tripTicketService.setAuthUser(authUser)
    return this.tripTicketService.remove_actual_start_time(id);
  }

  @Mutation(() => UpdateActualTimeResponse)
  @UseGuards(GqlAuthGuard, AccessGuard)
  removeActualEndTime(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.tripTicketService.setAuthUser(authUser)
    return this.tripTicketService.remove_actual_end_time(id);
  }

  @Mutation(() => UpdateActualTimeResponse)
  @UseGuards(GqlAuthGuard, AccessGuard)
  updateActualStartTime(
    @Args('input') input: UpdateActualStartTimeInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.tripTicketService.setAuthUser(authUser)
    return this.tripTicketService.update_actual_start_time(input.trip_ticket_id, input.actual_start_time);
  }

  @Mutation(() => UpdateActualTimeResponse)
  @UseGuards(GqlAuthGuard, AccessGuard)
  updateActualEndTime(
    @Args('input') input: UpdateActualEndTimeInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.tripTicketService.setAuthUser(authUser)
    return this.tripTicketService.update_actual_end_time(input.trip_ticket_id, input.actual_end_time);
  }

  @Query(() => [TripTicket])
  @UseGuards(GqlAuthGuard)
  async scheduled_trips(
    @Args('startDate', { type: () => String }) startDate: string,
    @Args('endDate', { type: () => String }) endDate: string,
  ) {
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return await this.tripTicketService.getScheduledTrips({ start, end } )

  }

  @ResolveField(() => Employee)
  @UseGuards(GqlAuthGuard)
  driver(@Parent() tripTicket: TripTicket): any {
      return { __typename: 'Employee', id: tripTicket.driver_id }
  }

  @ResolveField(() => Employee)
  @UseGuards(GqlAuthGuard)
  prepared_by(@Parent() tripTicket: TripTicket): any {
      return { __typename: 'Employee', id: tripTicket.prepared_by_id }
  }

  @ResolveField(() => [TripTicketApprover])
  @UseGuards(GqlAuthGuard)
  trip_ticket_approvers(@Parent() tripTicket: TripTicket): any {
      return this.tripTicketApproverService.findByTripTicketId(tripTicket.id)
  }

  @ResolveField(() => Boolean)
  can_update(
      @Parent() trip_ticket: TripTicket,
      @CurrentAuthUser() authUser: AuthUser
  ) {
      this.tripTicketService.setAuthUser(authUser)
      return this.tripTicketService.canUpdateForm(trip_ticket.id)
  }

}
