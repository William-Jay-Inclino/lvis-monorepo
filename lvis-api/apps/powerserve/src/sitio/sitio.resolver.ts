import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SitioService } from './sitio.service';
import { Sitio } from './entities/sitio.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { CreateSitioInput } from './dto/create-sitio.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MutationSitioResponse } from './entities/mutation-sitio-response';
import { UpdateSitioInput } from './dto/update-sitio.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => Sitio)
export class SitioResolver {

    private readonly logger = new Logger(SitioResolver.name);
    private filename = 'sitio.resolver.ts'

    constructor(
        private readonly sitioService: SitioService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Mutation(() => MutationSitioResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.SITIO, RESOLVERS.createSitio)
    async createSitio(
    @Args('input') input: CreateSitioInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
    ) {

        this.logger.log('Creating sitio...', {
            username: authUser.user.username,
            filename: this.filename,
            input: JSON.stringify(input)
        })
        
        try {
            const x = await this.sitioService.create(input, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
            
            this.logger.log('Sitio created successfully')

            return x

        } catch (error) {
            this.logger.error('Error in creating sitio', error)
        }

    }

    @Mutation(() => MutationSitioResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.SITIO, RESOLVERS.updateSitio)
    async updateSitio(
        @Args('id') id: string,
        @Args('input') input: UpdateSitioInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Updating sitio...', {
            username: authUser.user.username,
            filename: this.filename,
            sitio_id: id,
            input: JSON.stringify(input),
        })

        try {
        
            const x = await this.sitioService.update(id, input, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });

            this.logger.log('Sitio updated successfully')

            return x
        } catch (error) {
            this.logger.error('Error in updating sitio', error)
        }

    }


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
