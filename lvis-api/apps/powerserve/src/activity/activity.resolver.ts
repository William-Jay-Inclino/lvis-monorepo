import { Args, Query, Resolver } from '@nestjs/graphql';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Activity)
export class ActivityResolver {

    private readonly logger = new Logger(ActivityResolver.name);
    private filename = 'activity.resolver.ts'

    constructor(
        private readonly service: ActivityService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Activity])
    async activities() {
        try {
            return await this.service.findAll();
        } catch (error) {
            this.logger.error('Error in getting activities', error)
        }
    }

    @Query(() => Activity)
    async activity(@Args('id') id: string) {
        try {
            return await this.service.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting activity', error)            
        }
    }

}
