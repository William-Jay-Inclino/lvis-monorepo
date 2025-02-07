import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { SERIV } from './entities/seriv.entity';
import { CreateSerivInput } from './dto/create-seriv.input';
import { SerivService } from './seriv.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { UpdateSerivInput } from './dto/update-seriv.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { SERIVApprover } from '../seriv-approver/entities/seriv-approver.entity';
import { SerivApproverService } from '../seriv-approver/seriv-approver.service';
import { SERIVsResponse } from './entities/serivs-response.entity';
import { WarehouseCancelResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { APPROVAL_STATUS } from '../__common__/types';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => SERIV)
export class SerivResolver {

    private readonly logger = new Logger(SerivResolver.name);
    private filename = 'seriv.resolver.ts'

    constructor(
        private readonly serivService: SerivService,
        private readonly serivApproverService: SerivApproverService,
        private readonly audit: WarehouseAuditService,
    ) { }

    @Mutation(() => SERIV)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.SERIV, RESOLVERS.createSeriv)
    async createSeriv(
        @Args('input') createSerivInput: CreateSerivInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        this.logger.log('Creating SERIV...', {
          username: authUser.user.username,
          filename: this.filename,
          input: JSON.stringify(createSerivInput)
        })

        try {
            
            const x = await this.serivService.create(createSerivInput, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
            
            this.logger.log('SERIV created successfully')
      
            return x
      
        } catch (error) {
            this.logger.error('Error in creating SERIV', error)
        }
    }

    @Query(() => SERIVsResponse)
    serivs(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
        @Args('approval_status', { nullable: true }) approval_status?: number
    ) {
        return this.serivService.findAll(page, pageSize, date_requested, requested_by_id, approval_status);
    }

    @Query(() => [SERIV])
    serivs_by_seriv_number(
        @Args('seriv_number') seriv_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.serivService.findSerivsBySerivNumber(seriv_number, is_detail_included);
    }

    @Query(() => SERIV)
    seriv(
        @Args('id', { nullable: true }) id?: string,
        @Args('seriv_number', { nullable: true }) seriv_number?: string,
    ) {
        if (id) {
            return this.serivService.findBy({id});
        }
        if (seriv_number) {
            return this.serivService.findBy({seriv_number})
        }
    }

    @Mutation(() => SERIV)
    async updateSeriv(
        @Args('id') id: string,
        @Args('input') updateSerivInput: UpdateSerivInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        this.logger.log('Updating SERIV...', {
          username: authUser.user.username,
          filename: this.filename,
          seriv_id: id,
          input: JSON.stringify(updateSerivInput),
        })
        try {
            
            const x = await this.serivService.update(id, updateSerivInput, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
      
            this.logger.log('SERIV updated successfully')
      
            return x
        } catch (error) {
            this.logger.error('Error in updating SERIV', error)
        }
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelSeriv(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        this.logger.log('Cancelling SERIV...', {
          username: authUser.user.username,
          filename: this.filename,
          seriv_id: id,
        })

        try {

            const x = await this.serivService.cancel(id, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
            
            this.logger.log('SERIV cancelled successfully')
            
            return x 
      
        } catch (error) {
            this.logger.error('Error in cancelling SERIV', error)
        }
    }

    @ResolveField(() => Employee)
    requested_by(@Parent() seriv: SERIV): any {
        return { __typename: 'Employee', id: seriv.requested_by_id }
    }

    @ResolveField(() => Employee, { nullable: true })
    withdrawn_by(@Parent() seriv: SERIV): any {
        if(!seriv.withdrawn_by_id) {
            return null
        }
        return { __typename: 'Employee', id: seriv.withdrawn_by_id }
    }

    @ResolveField(() => [SERIVApprover])
    seriv_approvers(@Parent() seriv: SERIV): any {
        return this.serivApproverService.findBySerivId(seriv.id, seriv.seriv_number)
    }

    @ResolveField(() => Int)
    async status(@Parent() seriv: SERIV) {

        if (seriv.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        if(seriv.approval_status) {
            return seriv.approval_status
        }

        return await this.serivService.getStatus(seriv.id)

    }

    @ResolveField(() => Boolean)
    can_update(
        @Parent() seriv: SERIV,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        return this.serivService.canUpdateForm({ serivId: seriv.id, authUser })
    }

}
