import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MunicipalityService } from './municipality.service';
import { Municipality } from './entities/municipality.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { MutationMunicipalityResponse } from './entities/mutation-municipality-response';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { CreateMunicipalityInput } from './dto/create-municipality.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UpdateMunicipalityInput } from './dto/update-municipality.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => Municipality)
export class MunicipalityResolver {

    private readonly logger = new Logger(MunicipalityResolver.name);
    private filename = 'municipality.resolver.ts'

    constructor(
        private readonly municipalityService: MunicipalityService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Mutation(() => MutationMunicipalityResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MUNICIPALITY, RESOLVERS.createMunicipality)
    async createMunicipality(
        @Args('input') input: CreateMunicipalityInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
      ) {
    
        this.logger.log('Creating municipality...', {
            username: authUser.user.username,
            filename: this.filename,
            input: JSON.stringify(input)
        })
        
        try {
            const x = await this.municipalityService.create(input, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
          
            this.logger.log('Municipality created successfully')
        
            return x
    
        } catch (error) {
            this.logger.error('Error in creating municipality', error)
        }
    
    }

    @Mutation(() => MutationMunicipalityResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MUNICIPALITY, RESOLVERS.updateMunicipality)
    async updateMunicipality(
        @Args('id') id: string,
        @Args('input') input: UpdateMunicipalityInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Updating municipality...', {
            username: authUser.user.username,
            filename: this.filename,
            municipality_id: id,
            input: JSON.stringify(input),
        })

        try {
        
            const x = await this.municipalityService.update(id, input, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });

            this.logger.log('Municipality updated successfully')

            return x
        } catch (error) {
            this.logger.error('Error in updating municipality', error)
        }

    }

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
