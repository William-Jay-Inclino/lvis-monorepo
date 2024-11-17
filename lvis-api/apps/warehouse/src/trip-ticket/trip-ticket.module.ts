import { Module } from '@nestjs/common';
import { TripTicketService } from './trip-ticket.service';
import { TripTicketResolver } from './trip-ticket.resolver';
import { TripTicketApproverService } from '../trip-ticket-approver/trip-ticket-approver.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TripTicketResolver, TripTicketService, TripTicketApproverService],
})
export class TripTicketModule {}
