import { Args, Query, Resolver } from '@nestjs/graphql';
import { NatureOfComplaintService } from './nature_of_complaint.service';
import { NatureOfComplaint } from './entities/nature_of_complaint.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => NatureOfComplaint)
export class NatureOfComplaintResolver {

    private readonly logger = new Logger(NatureOfComplaintResolver.name);
    private filename = 'nature_of_complaint.resolver.ts'

    constructor(
        private readonly natureOfComplaintService: NatureOfComplaintService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [NatureOfComplaint])
    async nature_of_complaints() {
        try {
            return await this.natureOfComplaintService.findAll();
        } catch (error) {
            this.logger.error('Error in getting nature_of_complaints', error)
        }
    }

    @Query(() => NatureOfComplaint)
    async nature_of_complaint(@Args('id') id: string) {
        try {
            return await this.natureOfComplaintService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting nature_of_complaint', error)            
        }
    }

}
