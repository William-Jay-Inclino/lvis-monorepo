import { Args, Query, Resolver } from '@nestjs/graphql';
import { UnitService } from './unit.service';
import { PowerserveUnit } from './entities/unit';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => PowerserveUnit)
export class UnitResolver {

    private readonly logger = new Logger(UnitResolver.name);
    private filename = 'unit.resolver.ts'

    constructor(
        private readonly unitService: UnitService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [PowerserveUnit])
    async powerserve_units() {
        try {
            return await this.unitService.findAll();
        } catch (error) {
            this.logger.error('Error in getting units', error)
        }
    }

    @Query(() => PowerserveUnit)
    async powerserve_unit(@Args('id') id: string) {
        try {
            return await this.unitService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting unit', error)            
        }
    }

}
