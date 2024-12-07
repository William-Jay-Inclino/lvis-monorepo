import { Args, Mutation, Resolver, Query, ResolveField, Parent, Int } from '@nestjs/graphql';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, NotFoundException, UseGuards } from '@nestjs/common';
import { MeqsService } from './meqs.service';
import { MEQS } from './entities/meq.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { CreateMeqsInput } from './dto/create-meqs.input';
import { UpdateMeqsInput } from './dto/update-meqs.input';
import { Employee } from '../__employee__/entities/employee.entity';
import { MEQSApprover } from '../meqs-approver/entities/meqs-approver.entity';
import { MeqsApproverService } from '../meqs-approver/meqs-approver.service';
import { MEQSsResponse } from './entities/meqs-response.entity';
import { WarehouseCancelResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { RvService } from '../rv/rv.service';
import { SprService } from '../spr/spr.service';
import { JoService } from '../jo/jo.service';
import { RV } from '../rv/entities/rv.entity';
import { JO } from '../jo/entities/jo.entity';
import { SPR } from '../spr/entities/spr.entity';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { APPROVAL_STATUS } from '../__common__/types';

@UseGuards(GqlAuthGuard)
@Resolver(() => MEQS)
export class MeqsResolver {

    private readonly logger = new Logger(MeqsResolver.name);
    private filename = 'meqs.resolver.ts'

    constructor(
        private readonly meqsService: MeqsService,
        private readonly meqsApproverService: MeqsApproverService,
        private readonly rvService: RvService,
        private readonly sprService: SprService,
        private readonly joService: JoService,
    ) { }

    @Mutation(() => MEQS)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MEQS, RESOLVERS.createMeqs)
    async createMeqs(
        @Args('input') createMeqsInput: CreateMeqsInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        try {
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.createMeqs,
              input: JSON.stringify(createMeqsInput)
            })
            
            this.meqsService.setAuthUser(authUser)
      
            const x = await this.meqsService.create(createMeqsInput);
            
            this.logger.log('MEQS created successfully')
      
            return x
      
          } catch (error) {
            this.logger.error('Error in creating MEQS', error)
          }
    }

    @Query(() => MEQSsResponse)
    meqs(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
        @Args('supplier_id', { nullable: true }) supplier_id?: string,
        @Args('approval_status', { nullable: true }) approval_status?: number
    ) {
        return this.meqsService.findAll(page, pageSize, date_requested, requested_by_id, supplier_id, approval_status);
    }

    @Query(() => [MEQS])
    meqs_by_meqs_number(
        @Args('meqs_number') meqs_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.meqsService.findMeqsByMeqsNumber(meqs_number, is_detail_included);
    }

    @Query(() => MEQS)
    meq(
        @Args('id', { nullable: true }) id?: string,
        @Args('meqs_number', { nullable: true }) meqs_number?: string,
        @Args('rv_number', { nullable: true }) rv_number?: string,
        @Args('spr_number', { nullable: true }) spr_number?: string,
        @Args('jo_number', { nullable: true }) jo_number?: string,
    ) {
        if (id) {
            return this.meqsService.findOne(id);
        }
        if (meqs_number) {
            return this.meqsService.findByMeqsNumber(meqs_number)
        }
        if (rv_number) {
            return this.meqsService.findByReference({ rv_number })
        }
        if (spr_number) {
            return this.meqsService.findByReference({ spr_number })
        }
        if (jo_number) {
            return this.meqsService.findByReference({ jo_number })
        }
    }

    @Mutation(() => MEQS)
    async updateMeqs(
        @Args('id') id: string,
        @Args('input') updateMeqsInput: UpdateMeqsInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        try {
      
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.updateMeqs,
              meqs_id: id,
              input: JSON.stringify(updateMeqsInput),
            })
            
            this.meqsService.setAuthUser(authUser)
            const x = await this.meqsService.update(id, updateMeqsInput);
      
            this.logger.log('MEQS updated successfully')
      
            return x
        } catch (error) {
            this.logger.error('Error in updating MEQS', error)
        }

    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelMeqs(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        try {

            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: 'cancelMeqs',
              meqs_id: id,
            })
      
            this.meqsService.setAuthUser(authUser)
            const x = await this.meqsService.cancel(id);
            
            this.logger.log('MEQS cancelled successfully')
            
            return x 
      
        } catch (error) {
            this.logger.error('Error in cancelling MEQS', error)
        }

    }

    @ResolveField(() => [MEQSApprover])
    meqs_approvers(@Parent() meqs: MEQS): any {
        return this.meqsApproverService.findByMeqsId(meqs.id, meqs.meqs_number)
    }

    @ResolveField(() => Int)
    async status(@Parent() meqs: MEQS) {

        if (meqs.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        if(meqs.approval_status) {
            return meqs.approval_status
        }

        return await this.meqsService.getStatus(meqs.id)

    }

    @ResolveField(() => Employee)
    async requested_by(@Parent() meqs: MEQS) {
        
        if(meqs.rv_number) {
            const x = await this.rvService.findByRvNumber(meqs.rv_number) as unknown as RV
            return { __typename: 'Employee', id: x.canvass.requested_by_id }
        }

        if(meqs.jo_number) {
            const x = await this.joService.findByJoNumber(meqs.jo_number) as unknown as JO
            return { __typename: 'Employee', id: x.canvass.requested_by_id }
        }

        if(meqs.spr_number) {
            const x = await this.sprService.findBySprNumber(meqs.spr_number) as unknown as SPR
            return { __typename: 'Employee', id: x.canvass.requested_by_id }
        }

        throw new NotFoundException(`MEQS has no rv_number, spr_number, and jo_number`)

    }

    @ResolveField(() => Boolean)
    async is_rr_completed(@Parent() meqs: MEQS) {
        return await this.meqsService.isRrCompleted(meqs.id)
    }

    @ResolveField(() => Boolean)
    can_update(
        @Parent() meqs: MEQS,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.meqsService.setAuthUser(authUser)
        return this.meqsService.canUpdateForm(meqs.id)
    }

}
