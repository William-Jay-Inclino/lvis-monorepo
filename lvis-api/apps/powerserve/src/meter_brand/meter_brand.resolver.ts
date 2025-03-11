import { Args, Query, Resolver } from '@nestjs/graphql';
import { MeterBrandService } from './meter_brand.service';
import { MeterBrand } from './entities/meter_brand.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => MeterBrand)
export class MeterBrandResolver {

    private readonly logger = new Logger(MeterBrandResolver.name);
    private filename = 'meter_brand.resolver.ts'

    constructor(
        private readonly meterBrandService: MeterBrandService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [MeterBrand])
    async meter_brands() {
        try {
            return await this.meterBrandService.findAll();
        } catch (error) {
            this.logger.error('Error in getting meter_brands', error)
        }
    }

    @Query(() => MeterBrand)
    async meter_brand(@Args('id') id: string) {
        try {
            return await this.meterBrandService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting meter_brand', error)            
        }
    }

}
