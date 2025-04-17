import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { ShiftService } from './shift.service';
import { Shift } from './entities/shift.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Shift)
export class ShiftResolver {

    private readonly logger = new Logger(ShiftResolver.name);
    private filename = 'shift.resolver.ts'

    constructor(
        private readonly shiftService: ShiftService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Shift])
    async shifts() {
        try {
            return await this.shiftService.findAll();
        } catch (error) {
            this.logger.error('Error in getting shifts', error)
        }
    }

    @Query(() => Shift)
    async shift(
        @Args('id', { type: () => Int }) id: number,
    ) {
        try {
            return await this.shiftService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting shift', error)            
        }
    }

}
