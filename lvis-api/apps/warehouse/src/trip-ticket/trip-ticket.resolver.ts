import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { TripTicketService } from './trip-ticket.service';
import { TripTicket } from './entities/trip-ticket.entity';
import { CreateTripTicketInput } from './dto/create-trip-ticket.input';
import { WarehouseCancelResponse } from '../__common__/classes';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { Logger, UseGuards } from '@nestjs/common';
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
import { UpdateTripTicketInput } from './dto/update-trip-ticket.input';
import { CreateTripResponse } from './entities/create-trip-response.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

// @UseGuards(GqlAuthGuard)
@Resolver(() => TripTicket)
export class TripTicketResolver {

    private readonly logger = new Logger(TripTicketResolver.name);
    private filename = 'trip-ticket.resolver.ts'

  constructor(
    private readonly tripTicketService: TripTicketService,
    private readonly tripTicketApproverService: TripTicketApproverService,
    private readonly audit: WarehouseAuditService,
  ) { }

  @Mutation(() => CreateTripResponse)
  @UseGuards(GqlAuthGuard, AccessGuard)
  @CheckAccess(MODULES.TRIP_TICKET, RESOLVERS.createTripTicket)
  async createTripTicket(
    @Args('input') createTripTicketInput: CreateTripTicketInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ): Promise<CreateTripResponse> {
		this.logger.log('Creating trip ticket...', {
      username: authUser.user.username,
      filename: this.filename,
      input: JSON.stringify(createTripTicketInput)
		})
    try {
		
		this.tripTicketService.setAuthUser(authUser)

		const x = await this.tripTicketService.create(createTripTicketInput, {
      ip_address,
      device_info: this.audit.getDeviceInfo(user_agent)
    });
		
		this.logger.log(x.msg)

		return x

    } catch (error) {
		this.logger.error('Error in creating Trip Ticket', error);
    }
  }

  @Mutation(() => CreateTripResponse)
  @UseGuards(GqlAuthGuard, AccessGuard)
  async updateTripTicket(
      @Args('id') id: string,
      @Args('input') input: UpdateTripTicketInput,
      @CurrentAuthUser() authUser: AuthUser,
      @UserAgent() user_agent: string,
      @IpAddress() ip_address: string,
  ): Promise<CreateTripResponse> {
      this.logger.log('Updating trip ticket...', {
        username: authUser.user.username,
        filename: this.filename,
        trip_ticket_id: id,
        input: JSON.stringify(input),
      })
      try {
          this.tripTicketService.setAuthUser(authUser)
          const x = await this.tripTicketService.update(id, input, {
            ip_address,
            device_info: this.audit.getDeviceInfo(user_agent)
          });

          this.logger.log(x.msg)

          return x
      } catch (error) {
          this.logger.error('Error in updating Trip Ticket', error)
      }
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
    @Args('trip_status', { nullable: true }) trip_status?: number
  ): Promise<TripTicketsResponse> {
    try {
      return this.tripTicketService.findAll(page, pageSize, vehicle_id, driver_id, date_prepared, estimated_departure, trip_status);
    } catch (error) {
      this.logger.error('Error in getting trip tickets', error)
    }
  }

  @Query(() => [TripTicket])
  trip_tickets_by_trip_number(
      @Args('trip_number') trip_number: string,
      @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
  ){
      return this.tripTicketService.findTripsByTripNumber(trip_number, is_detail_included);
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

  @Mutation(() => WarehouseCancelResponse)
  @UseGuards(GqlAuthGuard)
  async cancelTripTicket(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Cancelling trip ticket...', {
      username: authUser.user.username,
      filename: this.filename,
      trip_ticket_id: id,
    })
    try {

      this.tripTicketService.setAuthUser(authUser)
      const x = await this.tripTicketService.cancel(id, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });
      
      this.logger.log('Trip Ticket cancelled successfully')
      
      return x 
  
    } catch (error) {
      this.logger.error('Error in cancelling Trip Ticket', error)
    }

  }

  @Mutation(() => UpdateActualTimeResponse)
  async updateActualTime(
    @Args('input') input: UpdateActualTimeInput,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ): Promise<UpdateActualTimeResponse> {

    this.logger.log('Scanning RFID of trip ticket / Updating actual time...', {
      username: 'N/A',
      filename: this.filename,
      rf_id: input.rf_id,
    })

    try {

      const x = await this.tripTicketService.update_actual_time(input.rf_id, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });
      
      this.logger.log(x.msg)
      
      return x 
  
    } catch (error) {
      this.logger.error('Error in updating actual time of Trip Ticket', error)
    }

  }

  @Mutation(() => UpdateActualTimeResponse)
  @UseGuards(GqlAuthGuard, AccessGuard)
  async removeActualStartTime(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Removing actual start time...', {
      username: authUser.user.username,
      filename: this.filename,
      trip_ticket_id: id,
    })
    try {

      this.tripTicketService.setAuthUser(authUser)
      const x = await this.tripTicketService.remove_actual_start_time(id, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });
      
      this.logger.log(x.msg)
      
      return x 
  
    } catch (error) {
      this.logger.error('Error in removing actual start time of Trip Ticket', error)
    }

  }

  @Mutation(() => UpdateActualTimeResponse)
  @UseGuards(GqlAuthGuard, AccessGuard)
  async removeActualEndTime(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Removing actual end time...', {
      username: authUser.user.username,
      filename: this.filename,
      trip_ticket_id: id,
    })
    try {

      this.tripTicketService.setAuthUser(authUser)
      const x = await this.tripTicketService.remove_actual_end_time(id, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });
      
      this.logger.log(x.msg)
      
      return x 
  
    } catch (error) {
      this.logger.error('Error in removing actual end time of Trip Ticket', error)
    }

  }

  @Mutation(() => UpdateActualTimeResponse)
  @UseGuards(GqlAuthGuard, AccessGuard)
  async updateActualStartTime(
    @Args('input') input: UpdateActualStartTimeInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Removing actual start time...', {
      username: authUser.user.username,
      filename: this.filename,
      input: JSON.stringify(input),
    })
    try {

      this.tripTicketService.setAuthUser(authUser)
      const x = await this.tripTicketService.update_actual_start_time(input.trip_ticket_id, input.actual_start_time, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });
      
      this.logger.log(x.msg)
      
      return x 
  
    } catch (error) {
      this.logger.error('Error in updating actual start time of Trip Ticket', error)
    }

  }

  @Mutation(() => UpdateActualTimeResponse)
  @UseGuards(GqlAuthGuard, AccessGuard)
  async updateActualEndTime(
    @Args('input') input: UpdateActualEndTimeInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Updating actual end time...', {
      username: authUser.user.username,
      filename: this.filename,
      input: JSON.stringify(input),
    })

    try {

      this.tripTicketService.setAuthUser(authUser)
      const x = await this.tripTicketService.update_actual_end_time(input.trip_ticket_id, input.actual_end_time, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });
      
      this.logger.log(x.msg)
      
      return x 
  
    } catch (error) {
      this.logger.error('Error in updating actual end time of Trip Ticket', error)
    }

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
      return this.tripTicketApproverService.findByTripTicketId(tripTicket.id, tripTicket.trip_number)
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
