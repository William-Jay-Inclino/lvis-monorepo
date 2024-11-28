import { Module } from '@nestjs/common';
import { MrvApproverService } from './mrv-approver.service';
import { MrvApproverResolver } from './mrv-approver.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [MrvApproverResolver, MrvApproverService, WinstonLoggerService],
})
export class MrvApproverModule {}
