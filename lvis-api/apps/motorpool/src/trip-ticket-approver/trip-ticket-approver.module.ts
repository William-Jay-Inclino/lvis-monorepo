import { Module } from '@nestjs/common';
import { TripTicketApproverService } from './trip-ticket-approver.service';
import { TripTicketApproverResolver } from './trip-ticket-approver.resolver';

@Module({
  providers: [TripTicketApproverResolver, TripTicketApproverService],
})
export class TripTicketApproverModule {}
