import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { SPR } from './entities/spr.entity';
import { CreateSprInput } from './dto/create-spr.input';
import { SprService } from './spr.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { Classification } from '../__classification__/entities/classification.entity';
import { UpdateSprInput } from './dto/update-spr.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { SPRApprover } from '../spr-approver/entities/spr-approver.entity';
import { SprApproverService } from '../spr-approver/spr-approver.service';
import { SPRsResponse } from './entities/sprs-response.entity';
import { WarehouseCancelResponse, WarehouseRemoveResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { UpdateSprByBudgetOfficerInput } from './dto/update-spr-by-budget-officer.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { APPROVAL_STATUS } from '../__common__/types';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => SPR)
export class SprResolver {

    private readonly logger = new Logger(SprResolver.name);
    private filename = 'spr.resolver.ts'

    constructor(
        private readonly sprService: SprService,
        private readonly sprApproverService: SprApproverService,
        private readonly audit: WarehouseAuditService,
    ) { }

    @Mutation(() => SPR)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.SPR, RESOLVERS.createSpr)
    async createSpr(
        @Args('input') createSprInput: CreateSprInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        try {
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.createSpr,
              input: JSON.stringify(createSprInput)
            })
            
            this.sprService.setAuthUser(authUser)
      
            const x = await this.sprService.create(createSprInput, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            });
            
            this.logger.log('SPR created successfully')
      
            return x
      
        } catch (error) {
            this.logger.error('Error in creating SPR', error)
        }
    }

    @Query(() => SPRsResponse)
    sprs(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
        @Args('approval_status', { nullable: true }) approval_status?: number
    ) {
        return this.sprService.findAll(page, pageSize, date_requested, requested_by_id, approval_status);
    }

    @Query(() => [SPR])
    sprs_by_spr_number(
        @Args('spr_number') spr_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.sprService.findSprsBySprNumber(spr_number, is_detail_included);
    }

    @Query(() => SPR)
    spr(
        @Args('id', { nullable: true }) id?: string,
        @Args('spr_number', { nullable: true }) spr_number?: string,
        @Args('rc_number', { nullable: true }) rc_number?: string
    ) {
        if (id) {
            return this.sprService.findOne(id);
        }
        if (spr_number) {
            return this.sprService.findBySprNumber(spr_number)
        }
        if (rc_number) {
            return this.sprService.findByRcNumber(rc_number)
        }
    }

    @Mutation(() => SPR)
    async updateSpr(
        @Args('id') id: string,
        @Args('input') updateSprInput: UpdateSprInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        try {
      
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.updateSpr,
              spr_id: id,
              input: JSON.stringify(updateSprInput),
            })
            
            this.sprService.setAuthUser(authUser)
            const x = await this.sprService.update(id, updateSprInput, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            });
      
            this.logger.log('SPR updated successfully')
      
            return x
        } catch (error) {
            this.logger.error('Error in updating SPR', error)
        }
    }

    // @Mutation(() => WarehouseRemoveResponse)
    // async update_spr_classification_and_spr_approver(
    //     @Args('id') id: string,
    //     @Args('input') input: UpdateSprByBudgetOfficerInput,
    //     @CurrentAuthUser() authUser: AuthUser
    // ) {
    //     try {
      
    //         this.logger.log({
    //           username: authUser.user.username,
    //           filename: this.filename,
    //           function: 'update_spr_classification_and_spr_approver',
    //           spr_id: id,
    //           input: JSON.stringify(input),
    //         })
            
    //         this.sprService.setAuthUser(authUser)
    //         const x = await this.sprService.updateClassificationByBudgetOfficer(id, input);
      
    //         this.logger.log('SPR Classification and SPR Approval updated successfully')
      
    //         return x
    //     } catch (error) {
    //         this.logger.error('Error in updating SPR Classification and SPR Approval', error)
    //     }
    // }

    @Mutation(() => WarehouseCancelResponse)
    async cancelSpr(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        try {

            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: 'cancelSpr',
              spr_id: id,
            })
      
            this.sprService.setAuthUser(authUser)
            const x = await this.sprService.cancel(id, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            });
            
            this.logger.log('SPR cancelled successfully')
            
            return x 
      
        } catch (error) {
            this.logger.error('Error in cancelling SPR', error)
        }
    }

    @ResolveField(() => Employee)
    async supervisor(@Parent() spr: SPR) {

        const supervisor_id = await this.sprService.get_supervisor_id(spr.id)

        return { __typename: 'Employee', id: supervisor_id }
    }

    @ResolveField(() => Classification, { nullable: true })
    classification(@Parent() spr: SPR): any {
        if (!spr.classification_id) {
            return null
        }
        return { __typename: 'Classification', id: spr.classification_id }
    }

    @ResolveField(() => [SPRApprover])
    spr_approvers(@Parent() spr: SPR): any {
        return this.sprApproverService.findBySprId(spr.id, spr.spr_number)
    }

    @ResolveField(() => Int)
    async status(@Parent() spr: SPR) {

        if (spr.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        if(spr.approval_status) {
            return spr.approval_status
        }

        return await this.sprService.getStatus(spr.id)

    }

    @ResolveField(() => Boolean)
    async is_referenced(@Parent() spr: SPR) {
        return await this.sprService.isReferenced(spr.id)
    }

    @ResolveField(() => Boolean)
    can_update(
        @Parent() spr: SPR,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.sprService.setAuthUser(authUser)
        return this.sprService.canUpdateForm(spr.id)
    }

}
