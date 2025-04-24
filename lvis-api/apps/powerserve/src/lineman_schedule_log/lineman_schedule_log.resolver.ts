import { Resolver } from '@nestjs/graphql';
import { LinemanScheduleLogService } from './lineman_schedule_log.service';

@Resolver()
export class LinemanScheduleLogResolver {
  constructor(private readonly linemanScheduleLogService: LinemanScheduleLogService) {}
}
