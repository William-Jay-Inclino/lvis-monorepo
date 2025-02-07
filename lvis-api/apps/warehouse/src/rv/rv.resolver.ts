import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { RV } from './entities/rv.entity';
import { CreateRvInput } from './dto/create-rv.input';
import { RvService } from './rv.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { Classification } from '../__classification__/entities/classification.entity';
import { UpdateRvInput } from './dto/update-rv.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { RVApprover } from '../rv-approver/entities/rv-approver.entity';
import { RvApproverService } from '../rv-approver/rv-approver.service';
import { RVsResponse } from './entities/rvs-response.entity';
import { WarehouseCancelResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { APPROVAL_STATUS } from '../__common__/types';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => RV)
export class RvResolver {

    private readonly logger = new Logger(RvResolver.name);
    private filename = 'rv.resolver.ts'

    constructor(
        private readonly rvService: RvService,
        private readonly rvApproverService: RvApproverService,
        private readonly audit: WarehouseAuditService,
    ) { }

    @Mutation(() => RV)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.RV, RESOLVERS.createRv)
    async createRv(
        @Args('input') createRvInput: CreateRvInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        this.logger.log('Creating RV...', {
          username: authUser.user.username,
          filename: this.filename,
          input: JSON.stringify(createRvInput)
        })

        try {
            
            const x = await this.rvService.create(createRvInput, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
            
            this.logger.log('RV created successfully')
      
            return x
      
        } catch (error) {
            this.logger.error('Error in creating RV', error)
        }
    }

    @Query(() => RVsResponse)
    rvs(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
        @Args('approval_status', { nullable: true }) approval_status?: number
    ) {
        return this.rvService.findAll(page, pageSize, date_requested, requested_by_id, approval_status);
    }

    @Query(() => [RV])
    rvs_by_rv_number(
        @Args('rv_number') rv_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.rvService.findRvsByRvNumber(rv_number, is_detail_included);
    }

    @Query(() => RV)
    rv(
        @Args('id', { nullable: true }) id?: string,
        @Args('rv_number', { nullable: true }) rv_number?: string,
        @Args('rc_number', { nullable: true }) rc_number?: string
    ) {
        if (id) {
            return this.rvService.findOne(id);
        }
        if (rv_number) {
            return this.rvService.findByRvNumber(rv_number)
        }
        if (rc_number) {
            return this.rvService.findByRcNumber(rc_number)
        }
    }

    @Mutation(() => RV)
    async updateRv(
        @Args('id') id: string,
        @Args('input') updateRvInput: UpdateRvInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        this.logger.log('Updating RV...', {
          username: authUser.user.username,
          filename: this.filename,
          rv_id: id,
          input: JSON.stringify(updateRvInput),
        })

        try {
            
            const x = await this.rvService.update(id, updateRvInput, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
      
            this.logger.log('RV updated successfully')
      
            return x
        } catch (error) {
            this.logger.error('Error in updating RV', error)
        }
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelRv(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        this.logger.log('Cancelling RV...', {
          username: authUser.user.username,
          filename: this.filename,
          rv_id: id,
        })

        try {
            const x = await this.rvService.cancel(id, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            });
            
            this.logger.log('RV cancelled successfully')
            
            return x 
      
        } catch (error) {
            this.logger.error('Error in cancelling RV', error)
        }

    }

    @ResolveField(() => Employee)
    async supervisor(@Parent() rv: RV) {

        const supervisor_id = await this.rvService.get_supervisor_id(rv.id)

        return { __typename: 'Employee', id: supervisor_id }
    }

    @ResolveField(() => Classification, { nullable: true })
    classification(@Parent() rv: RV): any {
        if (!rv.classification_id) {
            return null
        }
        return { __typename: 'Classification', id: rv.classification_id }
    }

    @ResolveField(() => [RVApprover])
    rv_approvers(@Parent() rv: RV): any {
        return this.rvApproverService.findByRvId(rv.id, rv.rv_number)
    }

    @ResolveField(() => Int)
    async status(@Parent() rv: RV) {

        if (rv.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        if(rv.approval_status) {
            return rv.approval_status
        }
        
        return await this.rvService.getStatus(rv.id)

    }

    @ResolveField(() => Boolean)
    async is_referenced(@Parent() rv: RV) {
        return await this.rvService.isReferenced(rv.id)
    }

    @ResolveField(() => Boolean)
    can_update(
        @Parent() rv: RV,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        return this.rvService.canUpdateForm({ rvId: rv.id, authUser })
    }

}
