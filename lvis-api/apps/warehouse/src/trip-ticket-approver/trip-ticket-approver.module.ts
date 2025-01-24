import { Module } from '@nestjs/common';
import { TripTicketApproverService } from './trip-ticket-approver.service';
import { TripTicketApproverResolver } from './trip-ticket-approver.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [WarehouseAuditModule],
  providers: [TripTicketApproverResolver, TripTicketApproverService, WinstonLoggerService],
})
export class TripTicketApproverModule {}
