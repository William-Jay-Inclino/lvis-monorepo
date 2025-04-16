import { Args, Query, Resolver } from '@nestjs/graphql';
import { EquipmentService } from './equipment.service';
import { Equipment } from './entities/equipment';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Equipment)
export class EquipmentResolver {

    private readonly logger = new Logger(EquipmentResolver.name);
    private filename = 'equipment.resolver.ts'

    constructor(
        private readonly equipmentService: EquipmentService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Equipment])
    async equipments() {
        try {
            return await this.equipmentService.findAll();
        } catch (error) {
            this.logger.error('Error in getting equipments', error)
        }
    }

    @Query(() => Equipment)
    async equipment(@Args('id') id: string) {
        try {
            return await this.equipmentService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting equipment', error)            
        }
    }

}
