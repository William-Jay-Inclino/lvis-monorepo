import { Module } from '@nestjs/common';
import { LinemanScheduleService } from './lineman_schedule.service';
import { LinemanScheduleResolver } from './lineman_schedule.resolver';

@Module({
  providers: [LinemanScheduleResolver, LinemanScheduleService],
})
export class LinemanScheduleModule {}
