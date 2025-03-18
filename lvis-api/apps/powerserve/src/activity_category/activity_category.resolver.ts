import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { ActivityCategoryService } from './activity_category.service';
import { ActivityCategory } from './entities/activity_category.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => ActivityCategory)
export class ActivityCategoryResolver {

    private readonly logger = new Logger(ActivityCategoryResolver.name);
    private filename = 'activity_category.resolver.ts'

    constructor(
        private readonly service: ActivityCategoryService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [ActivityCategory])
    async activity_categories() {
        try {
            return await this.service.findAll();
        } catch (error) {
            this.logger.error('Error in getting activity_categories', error)
        }
    }

    @Query(() => ActivityCategory)
    async activity_category(@Args('id', { type: () => Int }) id: number) {
        try {
            return await this.service.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting activity_category', error)            
        }
    }

}
