import { Module } from '@nestjs/common';
import { MrvService } from './mrv.service';
import { MrvResolver } from './mrv.resolver';
import { HttpModule } from '@nestjs/axios';
import { MrvApproverService } from '../mrv-approver/mrv-approver.service';
import { CommonService } from '../__common__/classes';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  imports: [HttpModule],
  providers: [MrvResolver, MrvService, MrvApproverService, CommonService, WinstonLoggerService],
})
export class MrvModule {}
