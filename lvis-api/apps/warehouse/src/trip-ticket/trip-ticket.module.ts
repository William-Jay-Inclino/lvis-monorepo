import { Module } from '@nestjs/common';
import { TripTicketService } from './trip-ticket.service';
import { TripTicketResolver } from './trip-ticket.resolver';

@Module({
  providers: [TripTicketResolver, TripTicketService],
})
export class TripTicketModule {}
