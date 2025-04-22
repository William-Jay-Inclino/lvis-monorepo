import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BarangayService } from './barangay.service';
import { Barangay } from './entities/barangay.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { MutationBarangayResponse } from './entities/mutation-barangay-response';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { CreateBarangayInput } from './dto/create-barangay.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { UpdateBarangayInput } from './dto/update-barangay.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => Barangay)
export class BarangayResolver {

    private readonly logger = new Logger(BarangayResolver.name);
    private filename = 'barangay.resolver.ts'

    constructor(
        private readonly barangayService: BarangayService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Mutation(() => MutationBarangayResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.BARANGAY, RESOLVERS.createBarangay)
    async createBarangay(
        @Args('input') input: CreateBarangayInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
      ) {
    
        this.logger.log('Creating barangay...', {
            username: authUser.user.username,
            filename: this.filename,
            input: JSON.stringify(input)
        })
        
        try {
            const x = await this.barangayService.create(input, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
          
            this.logger.log('Barangay created successfully')
        
            return x
    
        } catch (error) {
            this.logger.error('Error in creating barangay', error)
        }
    
    }

    @Mutation(() => MutationBarangayResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.BARANGAY, RESOLVERS.updateBarangay)
    async updateBarangay(
        @Args('id') id: string,
        @Args('input') input: UpdateBarangayInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Updating barangay...', {
            username: authUser.user.username,
            filename: this.filename,
            barangay_id: id,
            input: JSON.stringify(input),
        })

        try {
        
            const x = await this.barangayService.update(id, input, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });

            this.logger.log('Barangay updated successfully')

            return x
        } catch (error) {
            this.logger.error('Error in updating barangay', error)
        }

    }

    @Query(() => [Barangay])
    async barangays() {
        try {
            return await this.barangayService.findAll();
        } catch (error) {
            this.logger.error('Error in getting barangays', error)
        }
    }

    @Query(() => Barangay)
    async barangay(@Args('id') id: string) {
        try {
            return await this.barangayService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting barangay', error)            
        }
    }

}
