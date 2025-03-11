import { Args, Query, Resolver } from '@nestjs/graphql';
import { SitioService } from './sitio.service';
import { Sitio } from './entities/sitio.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Sitio)
export class SitioResolver {

    private readonly logger = new Logger(SitioResolver.name);
    private filename = 'sitio.resolver.ts'

    constructor(
        private readonly sitioService: SitioService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Sitio])
    async sitios() {
        try {
            return await this.sitioService.findAll();
        } catch (error) {
            this.logger.error('Error in getting sitios', error)
        }
    }

    @Query(() => Sitio)
    async sitio(@Args('id') id: string) {
        try {
            return await this.sitioService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting sitio', error)            
        }
    }

}
