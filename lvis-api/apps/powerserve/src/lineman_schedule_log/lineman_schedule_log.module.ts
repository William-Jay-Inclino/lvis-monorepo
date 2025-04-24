import { Module } from '@nestjs/common';
import { LinemanScheduleLogService } from './lineman_schedule_log.service';
import { LinemanScheduleLogResolver } from './lineman_schedule_log.resolver';

@Module({
  providers: [LinemanScheduleLogResolver, LinemanScheduleLogService],
})
export class LinemanScheduleLogModule {}
