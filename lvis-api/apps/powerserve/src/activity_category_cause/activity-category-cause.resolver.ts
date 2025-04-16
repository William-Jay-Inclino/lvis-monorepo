import { Args, Query, Resolver } from '@nestjs/graphql';
import { ActivityCategoryCauseService } from './activity-category-cause.service';
import { ActivityCategoryCause } from './entities/activity-category-cause';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => ActivityCategoryCause)
export class ActivityCategoryCauseResolver {

    private readonly logger = new Logger(ActivityCategoryCauseResolver.name);
    private filename = 'activity-category-cause.resolver.ts'

    constructor(
        private readonly service: ActivityCategoryCauseService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [ActivityCategoryCause])
    async activity_category_causes() {
        try {
            return await this.service.findAll();
        } catch (error) {
            this.logger.error('Error in getting activity category causes', error)
        }
    }

    @Query(() => ActivityCategoryCause)
    async activity_category_cause(@Args('id') id: string) {
        try {
            return await this.service.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting activity category cause', error)            
        }
    }

}
