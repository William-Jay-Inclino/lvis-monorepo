import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MRV } from './entities/mrv.entity';
import { CreateMrvInput } from './dto/create-mrv.input';
import { MrvService } from './mrv.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { UpdateMrvInput } from './dto/update-mrv.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { MRVApprover } from '../mrv-approver/entities/mrv-approver.entity';
import { MrvApproverService } from '../mrv-approver/mrv-approver.service';
import { MRVsResponse } from './entities/mrvs-response.entity';
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
@Resolver(() => MRV)
export class MrvResolver {

    private readonly logger = new Logger(MrvResolver.name);
    private filename = 'mrv.resolver.ts'

    constructor(
        private readonly mrvService: MrvService,
        private readonly mrvApproverService: MrvApproverService,
        private readonly audit: WarehouseAuditService,
    ) { }

    @Mutation(() => MRV)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MRV, RESOLVERS.createMrv)
    async createMrv(
        @Args('input') createMrvInput: CreateMrvInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        try {
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.createMrv,
              input: JSON.stringify(createMrvInput)
            })
            
            this.mrvService.setAuthUser(authUser)
      
            const x = await this.mrvService.create(createMrvInput, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            });
            
            this.logger.log('MRV created successfully')
      
            return x
      
          } catch (error) {
            this.logger.error('Error in creating MRV', error)
          }
    }

    @Query(() => MRVsResponse)
    mrvs(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
        @Args('approval_status', { nullable: true }) approval_status?: number
    ) {
        return this.mrvService.findAll(page, pageSize, date_requested, requested_by_id, approval_status);
    }

    @Query(() => [MRV])
    mrvs_by_mrv_number(
        @Args('mrv_number') mrv_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.mrvService.findMrvsByMrvNumber(mrv_number);
    }

    @Query(() => MRV)
    mrv(
        @Args('id', { nullable: true }) id?: string,
        @Args('mrv_number', { nullable: true }) mrv_number?: string,
    ) {
        if (id) {
            return this.mrvService.findBy({id});
        }
        if (mrv_number) {
            return this.mrvService.findBy({mrv_number})
        }
    }

    @Mutation(() => MRV)
    async updateMrv(
        @Args('id') id: string,
        @Args('input') updateMrvInput: UpdateMrvInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        try {
      
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.updateMrv,
              mrv_id: id,
              input: JSON.stringify(updateMrvInput),
            })
            
            this.mrvService.setAuthUser(authUser)
            const x = await this.mrvService.update(id, updateMrvInput, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            });
      
            this.logger.log('MRV updated successfully')
      
            return x
        } catch (error) {
            this.logger.error('Error in updating MRV', error)
        }
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelMrv(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        try {

            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: 'cancelMrv',
              mrv_id: id,
            })
      
            this.mrvService.setAuthUser(authUser)
            const x = await this.mrvService.cancel(id, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            });
            
            this.logger.log('MRV cancelled successfully')
            
            return x 
      
        } catch (error) {
            this.logger.error('Error in cancelling MRV', error)
        }
    }

    @ResolveField(() => Employee)
    requested_by(@Parent() mrv: MRV): any {
        return { __typename: 'Employee', id: mrv.requested_by_id }
    }

    @ResolveField(() => Employee, { nullable: true })
    withdrawn_by(@Parent() mrv: MRV): any {
        if(!mrv.withdrawn_by_id) {
            return null
        }
        return { __typename: 'Employee', id: mrv.withdrawn_by_id }
    }

    @ResolveField(() => [MRVApprover])
    mrv_approvers(@Parent() mrv: MRV): any {
        return this.mrvApproverService.findByMrvId(mrv.id, mrv.mrv_number)
    }

    @ResolveField(() => Int)
    async status(@Parent() mrv: MRV) {

        if (mrv.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        if(mrv.approval_status) {
            return mrv.approval_status
        }

        return await this.mrvService.getStatus(mrv.id)

    }

    @ResolveField(() => Boolean)
    async is_referenced(@Parent() mrv: MRV) {
        return await this.mrvService.isReferenced(mrv.id)
    }

    @ResolveField(() => Boolean)
    can_update(
        @Parent() mrv: MRV,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mrvService.setAuthUser(authUser)
        return this.mrvService.canUpdateForm(mrv.id)
    }

}
