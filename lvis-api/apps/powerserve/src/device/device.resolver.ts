import { Args, Query, Resolver } from '@nestjs/graphql';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Device)
export class DeviceResolver {

    private readonly logger = new Logger(DeviceResolver.name);
    private filename = 'device.resolver.ts'

    constructor(
        private readonly deviceService: DeviceService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Device])
    async devices() {
        try {
            return await this.deviceService.findAll();
        } catch (error) {
            this.logger.error('Error in getting devices', error)
        }
    }

    @Query(() => Device)
    async device(@Args('id') id: string) {
        try {
            return await this.deviceService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting device', error)            
        }
    }

}
