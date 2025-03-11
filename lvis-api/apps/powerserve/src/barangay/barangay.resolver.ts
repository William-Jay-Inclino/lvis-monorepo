import { Args, Query, Resolver } from '@nestjs/graphql';
import { BarangayService } from './barangay.service';
import { Barangay } from './entities/barangay.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Barangay)
export class BarangayResolver {

    private readonly logger = new Logger(BarangayResolver.name);
    private filename = 'barangay.resolver.ts'

    constructor(
        private readonly barangayService: BarangayService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Barangay])
    async barangays() {
        try {
            return await this.barangayService.findAll();
        } catch (error) {
            this.logger.error('Error in getting barangays', error)
        }
    }

    @Query(() => Barangay)
    async barangay(@Args('id') id: string) {
        try {
            return await this.barangayService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting barangay', error)            
        }
    }

}
