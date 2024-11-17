import { Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { TripTicketApproverService } from './trip-ticket-approver.service';
import { TripTicketApprover } from './entities/trip-ticket-approver.entity';
import { Employee } from '../__employee__/entities/employee.entity';
import { ChangeTripTicketApproverInput } from './dto/change-trip-ticket-approver.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Resolver(() => TripTicketApprover)
export class TripTicketApproverResolver {
  constructor(private readonly tripTicketApproverService: TripTicketApproverService) {}

  @ResolveField(() => Employee)
  approver(@Parent() tripTicketApprover: TripTicketApprover): any {
    console.log('tripTicketApprover', tripTicketApprover);
    return { __typename: 'Employee', id: tripTicketApprover.approver_id }
  }

  @Mutation(() => TripTicketApprover)
  async changeTripTicketApprover(
      @Args('id') id: string,
      @Args('input') input: ChangeTripTicketApproverInput,
      @CurrentAuthUser() authUser: AuthUser
  ) {
      this.tripTicketApproverService.setAuthUser(authUser)
      return await this.tripTicketApproverService.changeApprover(id, input);
  }

}
