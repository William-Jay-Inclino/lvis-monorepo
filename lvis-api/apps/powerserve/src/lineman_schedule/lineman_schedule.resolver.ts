import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LinemanScheduleService } from './lineman_schedule.service';
import { LinemanSchedule } from './entities/lineman_schedule.entity';
import { CreateLinemanScheduleInput } from './dto/create-lineman_schedule.input';
import { UpdateLinemanScheduleInput } from './dto/update-lineman_schedule.input';

@Resolver(() => LinemanSchedule)
export class LinemanScheduleResolver {
  constructor(private readonly linemanScheduleService: LinemanScheduleService) {}

  
}
