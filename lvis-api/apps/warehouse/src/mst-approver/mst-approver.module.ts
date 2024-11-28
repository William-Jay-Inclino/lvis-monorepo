import { Module } from '@nestjs/common';
import { MstApproverService } from './mst-approver.service';
import { MstApproverResolver } from './mst-approver.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [MstApproverResolver, MstApproverService, WinstonLoggerService],
})
export class MstApproverModule {}
