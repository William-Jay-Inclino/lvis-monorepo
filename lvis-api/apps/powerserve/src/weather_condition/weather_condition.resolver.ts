import { Args, Query, Resolver } from '@nestjs/graphql';
import { WeatherConditionService } from './weather_condition.service';
import { WeatherCondition } from './entities/weather_condition.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => WeatherCondition)
export class WeatherConditionResolver {

    private readonly logger = new Logger(WeatherConditionResolver.name);
    private filename = 'weather_condition.resolver.ts'

    constructor(
        private readonly weatherConditionService: WeatherConditionService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [WeatherCondition])
    async weather_conditions() {
        try {
            return await this.weatherConditionService.findAll();
        } catch (error) {
            this.logger.error('Error in getting weather_conditions', error)
        }
    }

    @Query(() => WeatherCondition)
    async weather_condition(@Args('id') id: string) {
        try {
            return await this.weatherConditionService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting weather_condition', error)            
        }
    }

}
