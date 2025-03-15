import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AreaService } from './area.service';
import { Area } from './entities/area.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { Employee } from '../__employee__  /entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => Area)
export class AreaResolver {

    private readonly logger = new Logger(AreaResolver.name);
    private filename = 'area.resolver.ts'

    constructor(
        private readonly areaService: AreaService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Area])
    async areas() {
        try {
            return await this.areaService.findAll();
        } catch (error) {
            this.logger.error('Error in getting areas', error)
        }
    }

    @Query(() => Area)
    async area(@Args('id') id: string) {
        try {
            return await this.areaService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting area', error)            
        }
    }

    @ResolveField(() => Employee)
    oic(@Parent() area: Area): any {
        return { __typename: 'Employee', id: area.oic_id }
    }

    @ResolveField(() => Int)
    async total_municipalities(@Parent() area: Area) {
        return await this.areaService.get_total_municipalities({ area_id: area.id }) 
    }

    @ResolveField(() => Int)
    async total_barangays(@Parent() area: Area) {
        return await this.areaService.get_total_barangays({ area_id: area.id }) 
    }

    @ResolveField(() => Int)
    async total_sitios(@Parent() area: Area) {
        return await this.areaService.get_total_sitios({ area_id: area.id }) 
    }

}
