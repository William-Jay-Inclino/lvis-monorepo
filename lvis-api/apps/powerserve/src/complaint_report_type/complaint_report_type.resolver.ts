import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { ComplaintReportTypeService } from './complaint_report_type.service';
import { ComplaintReportType } from './entities/complaint_report_type.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => ComplaintReportType)
export class ComplaintReportTypeResolver {

    private readonly logger = new Logger(ComplaintReportTypeResolver.name);
    private filename = 'complaint_report_type.resolver.ts'

    constructor(
        private readonly complaint_report_typeService: ComplaintReportTypeService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [ComplaintReportType])
    async complaint_report_types() {
        try {
            return await this.complaint_report_typeService.findAll();
        } catch (error) {
            this.logger.error('Error in getting complaint_report_types', error)
        }
    }

    @Query(() => ComplaintReportType)
    async complaint_report_type(@Args('id', { type: () => Int }) id: number) {
        try {
            return await this.complaint_report_typeService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting complaint_report_type', error)            
        }
    }

}
