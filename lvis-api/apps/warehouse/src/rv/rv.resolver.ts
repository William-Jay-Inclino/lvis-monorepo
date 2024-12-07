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
import { WarehouseCancelResponse, WarehouseRemoveResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { UpdateRvByBudgetOfficerInput } from './dto/update-rv-by-budget-officer.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { APPROVAL_STATUS } from '../__common__/types';

@UseGuards(GqlAuthGuard)
@Resolver(() => RV)
export class RvResolver {

    private readonly logger = new Logger(RvResolver.name);
    private filename = 'rv.resolver.ts'

    constructor(
        private readonly rvService: RvService,
        private readonly rvApproverService: RvApproverService
    ) { }

    @Mutation(() => RV)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.RV, RESOLVERS.createRv)
    async createRv(
        @Args('input') createRvInput: CreateRvInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        try {
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.createRv,
              input: JSON.stringify(createRvInput)
            })
            
            this.rvService.setAuthUser(authUser)
      
            const x = await this.rvService.create(createRvInput);
            
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
        @CurrentAuthUser() authUser: AuthUser
    ) {
        try {
      
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.updateRv,
              rv_id: id,
              input: JSON.stringify(updateRvInput),
            })
            
            this.rvService.setAuthUser(authUser)
            const x = await this.rvService.update(id, updateRvInput);
      
            this.logger.log('RV updated successfully')
      
            return x
        } catch (error) {
            this.logger.error('Error in updating RV', error)
        }
    }

    @Mutation(() => WarehouseRemoveResponse)
    async update_rv_classification_and_rv_approver(
        @Args('id') id: string,
        @Args('input') input: UpdateRvByBudgetOfficerInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        try {
      
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: 'update_rv_classification_and_rv_approver',
              rv_id: id,
              input: JSON.stringify(input),
            })
            
            this.rvService.setAuthUser(authUser)
            const x = await this.rvService.updateClassificationByBudgetOfficer(id, input);
      
            this.logger.log('RV Classification and RV Approval updated successfully')
      
            return x
        } catch (error) {
            this.logger.error('Error in updating RV Classification and RV Approval', error)
        }
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelRv(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        try {

            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: 'cancelRv',
              rv_id: id,
            })
      
            this.rvService.setAuthUser(authUser)
            const x = await this.rvService.cancel(id);
            
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
        this.rvService.setAuthUser(authUser)
        return this.rvService.canUpdateForm(rv.id)
    }

}
