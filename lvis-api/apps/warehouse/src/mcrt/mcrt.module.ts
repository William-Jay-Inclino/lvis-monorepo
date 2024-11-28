import { Module } from '@nestjs/common';
import { McrtService } from './mcrt.service';
import { McrtResolver } from './mcrt.resolver';
import { McrtApproverService } from '../mcrt-approver/mcrt-approver.service';
import { HttpModule } from '@nestjs/axios';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  imports: [HttpModule],
  providers: [McrtResolver, McrtService, McrtApproverService, WinstonLoggerService],
})
export class McrtModule {}
