import { Module } from '@nestjs/common';
import { WeatherConditionService } from './weather_condition.service';
import { WeatherConditionResolver } from './weather_condition.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [WeatherConditionResolver, WeatherConditionService],
})
export class WeatherConditionModule {}
