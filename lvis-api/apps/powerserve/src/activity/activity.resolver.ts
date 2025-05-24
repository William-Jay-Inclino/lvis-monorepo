import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { MutationPowerserveActivityResponse } from './entities/mutation-activity-response';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { CreatePowerserveActivityInput } from './dto/create-activity.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UpdatePowerserveActivityInput } from './dto/update-activity.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => Activity)
export class ActivityResolver {

    private readonly logger = new Logger(ActivityResolver.name);
    private filename = 'activity.resolver.ts'

    constructor(
        private readonly service: ActivityService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Mutation(() => MutationPowerserveActivityResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.POWERSERVE_ACTIVITY, RESOLVERS.powerserveCreateActivity)
    async createPowerserveActivity(
        @Args('input') input: CreatePowerserveActivityInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
      ) {
    
        this.logger.log('Creating powerserve activity...', {
            username: authUser.user.username,
            filename: this.filename,
            input: JSON.stringify(input)
        })
        
        try {
            const x = await this.service.create(input, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
          
            this.logger.log('Powerserve activity created successfully')
        
            return x
    
        } catch (error) {
            this.logger.error('Error in creating powerserve activity', error)
        }
    
    }

    @Mutation(() => MutationPowerserveActivityResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.POWERSERVE_ACTIVITY, RESOLVERS.powerserveUpdateActivity)
    async updatePowerserveActivity(
        @Args('id') id: string,
        @Args('input') input: UpdatePowerserveActivityInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Updating powerserve activity...', {
            username: authUser.user.username,
            filename: this.filename,
            activity_id: id,
            input: JSON.stringify(input),
        })

        try {
        
            const x = await this.service.update(id, input, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });

            this.logger.log('Powerserve activity updated successfully')

            return x
        } catch (error) {
            this.logger.error('Error in updating powerserve activity', error)
        }

    }

    @Query(() => [Activity])
    async activities() {
        try {
            return await this.service.findAll();
        } catch (error) {
            this.logger.error('Error in getting activities', error)
        }
    }

    @Query(() => Activity)
    async activity(@Args('id') id: string) {
        try {
            return await this.service.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting activity', error)            
        }
    }

    @Mutation(() => MutationPowerserveActivityResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.POWERSERVE_ACTIVITY, RESOLVERS.powerserveRemoveActivity)
    async removePowerserveActivity(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        this.logger.log('Removing powerserve activity...', {
            username: authUser.user.username,
            filename: this.filename,
            barangay_id: id,
        })

        try {
            const x = await this.service.remove(id, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
            
            this.logger.log('Powerserve activity removed successfully')
            
            return x 

        } catch (error) {
            this.logger.error('Error in removing powerserve activity', error)
        }
    }

}
