import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { RemarksService } from './remarks.service';
import { Remarks } from './entities/remarks';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Remarks)
export class RemarksResolver {

    private readonly logger = new Logger(RemarksResolver.name);
    private filename = 'remarks.resolver.ts'

    constructor(
        private readonly service: RemarksService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Remarks])
    async remarks() {
        try {
            return await this.service.findAll();
        } catch (error) {
            this.logger.error('Error in getting remarks', error)
        }
    }

    @Query(() => Remarks)
    async remark(@Args('id', { type: () => Int }) id: number,) {
        try {
            return await this.service.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting remark', error)            
        }
    }

}
