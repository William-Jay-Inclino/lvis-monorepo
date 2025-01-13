import { Module } from '@nestjs/common';
import { TripTicketService } from './trip-ticket.service';
import { TripTicketResolver } from './trip-ticket.resolver';
import { TripTicketApproverService } from '../trip-ticket-approver/trip-ticket-approver.service';
import { HttpModule } from '@nestjs/axios';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { TripTicketController } from './trip-ticket.controller';
import { TripTicketReportService } from './trip-ticket-report.service';

@Module({
  imports: [HttpModule],
  providers: [
    TripTicketResolver, 
    TripTicketService, 
    TripTicketApproverService, 
    WinstonLoggerService,
    TripTicketReportService,
  ],
  controllers: [TripTicketController]
})
export class TripTicketModule {}
