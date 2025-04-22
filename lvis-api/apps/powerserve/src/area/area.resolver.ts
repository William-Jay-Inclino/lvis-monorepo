import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AreaService } from './area.service';
import { Area } from './entities/area.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { Employee } from '../__employee__  /entities/employee.entity';
import { MutationAreaResponse } from './entities/mutation-area-response';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { CreateAreaInput } from './dto/create-area.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { UpdateAreaInput } from './dto/update-area.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => Area)
export class AreaResolver {

    private readonly logger = new Logger(AreaResolver.name);
    private filename = 'area.resolver.ts'

    constructor(
        private readonly areaService: AreaService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Mutation(() => MutationAreaResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.AREA, RESOLVERS.createArea)
    async createArea(
        @Args('input') input: CreateAreaInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
      ) {
    
        this.logger.log('Creating area...', {
            username: authUser.user.username,
            filename: this.filename,
            input: JSON.stringify(input)
        })
        
        try {
            const x = await this.areaService.create(input, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
          
            this.logger.log('Area created successfully')
        
            return x
    
        } catch (error) {
            this.logger.error('Error in creating area', error)
        }
    
    }

    @Mutation(() => MutationAreaResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.AREA, RESOLVERS.updateArea)
    async updateArea(
        @Args('id') id: string,
        @Args('input') input: UpdateAreaInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Updating area...', {
            username: authUser.user.username,
            filename: this.filename,
            area_id: id,
            input: JSON.stringify(input),
        })

        try {
        
            const x = await this.areaService.update(id, input, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });

            this.logger.log('Area updated successfully')

            return x
        } catch (error) {
            this.logger.error('Error in updating area', error)
        }

    }

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

    @ResolveField(() => Int)
    async total_lineman(@Parent() area: Area) {
        return await this.areaService.get_total_lineman({ area_id: area.id }) 
    }

}
