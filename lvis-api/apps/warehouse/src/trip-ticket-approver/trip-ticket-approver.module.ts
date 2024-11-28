import { Module } from '@nestjs/common';
import { TripTicketApproverService } from './trip-ticket-approver.service';
import { TripTicketApproverResolver } from './trip-ticket-approver.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [TripTicketApproverResolver, TripTicketApproverService, WinstonLoggerService],
})
export class TripTicketApproverModule {}
