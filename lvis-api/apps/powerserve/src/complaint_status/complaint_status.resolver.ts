import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ComplaintStatusService } from './complaint_status.service';
import { ComplaintStatus } from './entities/complaint_status.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => ComplaintStatus)
export class ComplaintStatusResolver {

    private readonly logger = new Logger(ComplaintStatusResolver.name);
    private filename = 'complaint_status.resolver.ts'

    constructor(
        private readonly service: ComplaintStatusService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [ComplaintStatus])
    async complaint_statuses() {
        try {
            return await this.service.findAll();
        } catch (error) {
            this.logger.error('Error in getting complaint_statuss', error)
        }
    }

    @Query(() => ComplaintStatus)
    async complaint_status(@Args('id', { type: () => Int }) id: number) {
        try {
            return await this.service.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting complaint_status', error)            
        }
    }

    @ResolveField(() => Int)
    total(@Parent() status: ComplaintStatus): any {
        return this.service.get_total_status({ status_id: status.id })
    }

}
