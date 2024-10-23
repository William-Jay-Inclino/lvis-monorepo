import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MCT } from './entities/mct.entity';
import { CreateMctInput } from './dto/create-mct.input';
import { MctService } from './mct.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { UpdateMctInput } from './dto/update-mct.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { MCTApprover } from '../mct-approver/entities/mct-approver.entity';
import { MctApproverService } from '../mct-approver/mct-approver.service';
import { MCTsResponse } from './entities/mcts-response.entity';
import { WarehouseCancelResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MrvService } from '../mrv/mrv.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { APPROVAL_STATUS } from '../__common__/types';

@UseGuards(GqlAuthGuard)
@Resolver(() => MCT)
export class MctResolver {

    constructor(
        private readonly mctService: MctService,
        private readonly mrvService: MrvService,
        private readonly mctApproverService: MctApproverService,
    ) { }

    @Mutation(() => MCT)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MCT, RESOLVERS.createMct)
    async createMct(
        @Args('input') createMctInput: CreateMctInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mctService.setAuthUser(authUser)
        return await this.mctService.create(createMctInput);
    }

    @Query(() => MCTsResponse)
    mcts(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
    ) {
        return this.mctService.findAll(page, pageSize, date_requested, requested_by_id);
    }

    @Query(() => [MCT])
    mcts_by_mct_number(
        @Args('mct_number') mct_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.mctService.findMctsByMctNumber(mct_number, is_detail_included);
    }

    @Query(() => MCT)
    mct(
        @Args('id', { nullable: true }) id?: string,
        @Args('mct_number', { nullable: true }) mct_number?: string,
    ) {
        if (id) {
            return this.mctService.findBy({id});
        }
        if (mct_number) {
            return this.mctService.findBy({mct_number})
        }
    }

    @Mutation(() => MCT)
    async updateMct(
        @Args('id') id: string,
        @Args('input') updateMctInput: UpdateMctInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mctService.setAuthUser(authUser)
        return await this.mctService.update(id, updateMctInput);
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelMct(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mctService.setAuthUser(authUser)
        return await this.mctService.cancel(id);
    }

    @ResolveField(() => [MCTApprover])
    mct_approvers(@Parent() mct: MCT): any {
        return this.mctApproverService.findByMctId(mct.id)
    }

    @ResolveField(() => Int)
    async status(@Parent() mct: MCT) {

        if (mct.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        return await this.mctService.getStatus(mct.id)

    }

    @ResolveField(() => Employee)
    async requested_by(@Parent() mct: MCT): Promise<any> {
        const mrv = await this.mrvService.findBy({ mrv_number: mct.mrv_number })
        if(!mrv) {
            throw new NotFoundException(`mrv number: ${mct.mrv_number} not found in mrv table`)
        }
        return { __typename: 'Employee', id: mrv.requested_by_id }
    }

    // @ResolveField(() => Boolean)
    // async is_referenced(@Parent() mct: MCT) {
    //     return await this.mctService.isReferenced(mct.id)
    // }

    @ResolveField(() => Boolean)
    can_update(
        @Parent() mct: MCT,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mctService.setAuthUser(authUser)
        return this.mctService.canUpdateForm(mct.id)
    }

}
