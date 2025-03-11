import { Args, Query, Resolver } from '@nestjs/graphql';
import { MunicipalityService } from './municipality.service';
import { Municipality } from './entities/municipality.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Municipality)
export class MunicipalityResolver {

    private readonly logger = new Logger(MunicipalityResolver.name);
    private filename = 'municipality.resolver.ts'

    constructor(
        private readonly municipalityService: MunicipalityService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Municipality])
    async municipalities() {
        try {
            return await this.municipalityService.findAll();
        } catch (error) {
            this.logger.error('Error in getting municipalities', error)
        }
    }

    @Query(() => Municipality)
    async municipality(@Args('id') id: string) {
        try {
            return await this.municipalityService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting municipality', error)            
        }
    }

}
