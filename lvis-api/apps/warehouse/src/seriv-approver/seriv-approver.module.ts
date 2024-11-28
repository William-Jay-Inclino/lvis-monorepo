import { Module } from '@nestjs/common';
import { SerivApproverService } from './seriv-approver.service';
import { SerivApproverResolver } from './seriv-approver.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [SerivApproverResolver, SerivApproverService, WinstonLoggerService],
})
export class SerivApproverModule {}
