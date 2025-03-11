import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { ComplaintCategoryService } from './complaint_category.service';
import { ComplaintCategory } from './entities/complaint_category.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => ComplaintCategory)
export class ComplaintCategoryResolver {

    private readonly logger = new Logger(ComplaintCategoryResolver.name);
    private filename = 'complaint_category.resolver.ts'

    constructor(
        private readonly complaintCategoryService: ComplaintCategoryService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [ComplaintCategory])
    async complaint_categories() {
        try {
            return await this.complaintCategoryService.findAll();
        } catch (error) {
            this.logger.error('Error in getting complaint_categories', error)
        }
    }

    @Query(() => ComplaintCategory)
    async complaint_category(@Args('id', { type: () => Int }) id: number) {
        try {
            return await this.complaintCategoryService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting complaint_category', error)            
        }
    }

}
