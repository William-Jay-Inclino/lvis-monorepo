import { Args, Query, Resolver } from '@nestjs/graphql';
import { LinemanService } from './lineman.service';
import { Lineman } from './entities/lineman.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Lineman)
export class LinemanResolver {

    private readonly logger = new Logger(LinemanResolver.name);
    private filename = 'lineman.resolver.ts'

    constructor(
        private readonly linemanService: LinemanService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Lineman])
    async linemen() {
        try {
            return await this.linemanService.findAll();
        } catch (error) {
            this.logger.error('Error in getting linemen', error)
        }
    }

    @Query(() => Lineman)
    async lineman(@Args('id') id: string) {
        try {
            return await this.linemanService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting lineman', error)            
        }
    }

}
