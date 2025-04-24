import { Module } from '@nestjs/common';
import { LinemanScheduleService } from './lineman_schedule.service';
import { LinemanScheduleResolver } from './lineman_schedule.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
    imports: [PowerserveAuditModule],
  providers: [LinemanScheduleResolver, LinemanScheduleService],
})
export class LinemanScheduleModule {}
