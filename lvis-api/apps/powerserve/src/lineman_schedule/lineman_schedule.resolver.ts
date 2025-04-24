import { Resolver } from '@nestjs/graphql';
import { LinemanScheduleService } from './lineman_schedule.service';
import { LinemanSchedule } from './entities/lineman_schedule.entity';

@Resolver(() => LinemanSchedule)
export class LinemanScheduleResolver {
  constructor(private readonly linemanScheduleService: LinemanScheduleService) {}

  
}
