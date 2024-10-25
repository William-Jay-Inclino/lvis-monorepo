import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TripTicketApproverService } from './trip-ticket-approver.service';
import { TripTicketApprover } from './entities/trip-ticket-approver.entity';
import { CreateTripTicketApproverInput } from './dto/create-trip-ticket-approver.input';
import { UpdateTripTicketApproverInput } from './dto/update-trip-ticket-approver.input';

@Resolver(() => TripTicketApprover)
export class TripTicketApproverResolver {
  constructor(private readonly tripTicketApproverService: TripTicketApproverService) {}

  @Mutation(() => TripTicketApprover)
  createTripTicketApprover(@Args('createTripTicketApproverInput') createTripTicketApproverInput: CreateTripTicketApproverInput) {
    return this.tripTicketApproverService.create(createTripTicketApproverInput);
  }

  @Query(() => [TripTicketApprover], { name: 'tripTicketApprover' })
  findAll() {
    return this.tripTicketApproverService.findAll();
  }

  @Query(() => TripTicketApprover, { name: 'tripTicketApprover' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tripTicketApproverService.findOne(id);
  }

  @Mutation(() => TripTicketApprover)
  updateTripTicketApprover(@Args('updateTripTicketApproverInput') updateTripTicketApproverInput: UpdateTripTicketApproverInput) {
    return this.tripTicketApproverService.update(updateTripTicketApproverInput.id, updateTripTicketApproverInput);
  }

  @Mutation(() => TripTicketApprover)
  removeTripTicketApprover(@Args('id', { type: () => Int }) id: number) {
    return this.tripTicketApproverService.remove(id);
  }
}
