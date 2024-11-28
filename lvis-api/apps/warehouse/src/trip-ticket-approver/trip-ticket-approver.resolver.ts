import { Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { TripTicketApproverService } from './trip-ticket-approver.service';
import { TripTicketApprover } from './entities/trip-ticket-approver.entity';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeTripTicketApproverInput } from './dto/change-trip-ticket-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => TripTicketApprover)
export class TripTicketApproverResolver {

  private readonly logger = new Logger(TripTicketApproverResolver.name);
  private filename = 'trip-ticket-approver.resolver.ts'

  constructor(private readonly tripTicketApproverService: TripTicketApproverService) {}

  @ResolveField(() => Employee)
  approver(@Parent() tripTicketApprover: TripTicketApprover): any {
    return { __typename: 'Employee', id: tripTicketApprover.approver_id }
  }

  @Mutation(() => TripTicketApprover)
  async changeTripTicketApprover(
      @Args('id') id: string,
      @Args('input') input: ChangeTripTicketApproverInput,
      @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'changeTripTicketApprover',
        trip_ticket_approver_id: id,
        input: JSON.stringify(input)
      })
      
      this.tripTicketApproverService.setAuthUser(authUser)

      const x = await this.tripTicketApproverService.changeApprover(id, input);
      
      this.logger.log('Trip Ticket Approver changed successfully')

      return x

    } catch (error) {
      this.logger.error('Error in changing Trip Ticket Approver', error)
    }
  }

}
