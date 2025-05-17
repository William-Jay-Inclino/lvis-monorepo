import { Args, Parent, Query, Resolver, ResolveField, Mutation } from '@nestjs/graphql';
import { LinemanService } from './lineman.service';
import { Lineman } from './entities/lineman.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { Employee } from '../__employee__  /entities/employee.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MutationLinemanResponse } from './entities/mutation-lineman-response';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { CreateLinemanInput } from './dto/create-lineman.input';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UpdateLinemanInput } from './dto/update-lineman.input';
import { LinemanStatus } from 'apps/powerserve/prisma/generated/client';

@UseGuards(GqlAuthGuard)
@Resolver(() => Lineman)
export class LinemanResolver {

    private readonly logger = new Logger(LinemanResolver.name);
    private filename = 'lineman.resolver.ts'

    constructor(
        private readonly linemanService: LinemanService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Mutation(() => MutationLinemanResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.LINEMAN, RESOLVERS.createLineman)
    async createLineman(
        @Args('input') createLinemanInput: CreateLinemanInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
      ) {
    
        this.logger.log('Creating lineman...', {
          username: authUser.user.username,
          filename: this.filename,
          input: JSON.stringify(createLinemanInput)
        })
        
        try {
          const x = await this.linemanService.create(createLinemanInput, {
            ip_address,
            device_info: this.audit.getDeviceInfo(user_agent),
            authUser,
          });
          
          this.logger.log('Lineman created successfully')
    
          return x
    
        } catch (error) {
          this.logger.error('Error in creating lineman', error)
        }
    
    }

    @Mutation(() => MutationLinemanResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.LINEMAN, RESOLVERS.updateLineman)
    async updateLineman(
        @Args('id') id: string,
        @Args('input') updateLinemanInput: UpdateLinemanInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Updating lineman...', {
            username: authUser.user.username,
            filename: this.filename,
            lineman_id: id,
            input: JSON.stringify(updateLinemanInput),
        })

        try {
        
        const x = await this.linemanService.update(id, updateLinemanInput, {
            ip_address,
            device_info: this.audit.getDeviceInfo(user_agent),
            authUser,
        });

        this.logger.log('Lineman updated successfully')

        return x
        } catch (error) {
        this.logger.error('Error in updating lineman', error)
        }

    }

    @Query(() => [Lineman])
    async linemen(
        @Args('area_id', { type: () => String, nullable: true }) area_id?: string,
        @Args('with_schedule', { 
            type: () => Boolean, 
            nullable: true, 
            defaultValue: false 
        }) with_schedule?: boolean,
        @Args('status', { 
            type: () => LinemanStatus, 
            nullable: true,
            description: 'Filter by lineman status (ACTIVE, INACTIVE)' 
        }) status?: LinemanStatus
        ) {
        try {
            return await this.linemanService.findAll({ 
                area_id, 
                with_schedule,
                status 
            });
        } catch (error) {
            this.logger.error('Error in getting linemen', error);
            throw error;
        }
    }

    @Query(() => [Lineman])
    async linemen_with_activities(
    @Args('start_date', { type: () => String }) start_date: string,
    @Args('end_date', { type: () => String }) end_date: string,
    @Args('employee_id', { type: () => String, nullable: true }) employee_id?: string | null
    ) {
    return this.linemanService.get_lineman_activities({ 
        start_date, 
        end_date,
        employee_id
    });
    }

    @Query(() => [Lineman])
    async linemen_by_current_user(
        @CurrentAuthUser() authUser: AuthUser,
    ) {
        try {
            return await this.linemanService.get_all_lineman_by_current_user({ authUser });
        } catch (error) {
            this.logger.error('Error in getting linemen_by_group', error)
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

    @Mutation(() => MutationLinemanResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.LINEMAN, RESOLVERS.removeLineman)
    async removeLineman(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Removing lineman...', {
            username: authUser.user.username,
            filename: this.filename,
            lineman_id: id,
        })

        try {

        const x = await this.linemanService.remove(id, {
            ip_address,
            device_info: this.audit.getDeviceInfo(user_agent),
            authUser,
        });
        
        this.logger.log('Lineman removed successfully')
        
        return x 

        } catch (error) {
            this.logger.error('Error in removing lineman', error)
        }

    }

    @ResolveField(() => Employee)
    employee(@Parent() lineman: Lineman): any {
        return { __typename: 'Employee', id: lineman.employee_id }
    }

    @ResolveField(() => Employee)
    supervisor(@Parent() lineman: Lineman): any {
        return { __typename: 'Employee', id: lineman.supervisor_id }
    }

}
