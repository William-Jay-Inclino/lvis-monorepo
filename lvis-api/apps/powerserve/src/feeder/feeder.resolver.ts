import { Args, Query, Resolver } from '@nestjs/graphql';
import { FeederService } from './feeder.service';
import { Feeder } from './entities/feeder.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Feeder)
export class FeederResolver {

    private readonly logger = new Logger(FeederResolver.name);
    private filename = 'feeder.resolver.ts'

    constructor(
        private readonly feederService: FeederService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Feeder])
    async feeders() {
        try {
            return await this.feederService.findAll();
        } catch (error) {
            this.logger.error('Error in getting feeders', error)
        }
    }

    @Query(() => Feeder)
    async feeder(@Args('id') id: string) {
        try {
            return await this.feederService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting feeder', error)            
        }
    }

}
