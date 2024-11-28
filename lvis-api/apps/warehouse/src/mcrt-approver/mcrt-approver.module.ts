import { Module } from '@nestjs/common';
import { McrtApproverService } from './mcrt-approver.service';
import { McrtApproverResolver } from './mcrt-approver.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [McrtApproverResolver, McrtApproverService, WinstonLoggerService],
})
export class McrtApproverModule {}
