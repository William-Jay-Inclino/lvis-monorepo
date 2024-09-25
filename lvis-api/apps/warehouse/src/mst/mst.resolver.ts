import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MST } from './entities/mst.entity';
import { CreateMstInput } from './dto/create-mst.input';
import { MstService } from './mst.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { UpdateMstInput } from './dto/update-mst.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { MSTApprover } from '../mst-approver/entities/mst-approver.entity';
import { MstApproverService } from '../mst-approver/mst-approver.service';
import { MSTsResponse } from './entities/msts-response.entity';
import { APPROVAL_STATUS, MODULES, RESOLVERS } from '../__common__/types';
import { WarehouseCancelResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => MST)
export class MstResolver {

    constructor(
        private readonly mstService: MstService,
        private readonly mstApproverService: MstApproverService
    ) { }

    @Mutation(() => MST)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MST, RESOLVERS.createMst)
    async createMst(
        @Args('input') createMstInput: CreateMstInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mstService.setAuthUser(authUser)
        return await this.mstService.create(createMstInput);
    }

    @Query(() => MSTsResponse)
    msts(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('returned_by_id', { nullable: true }) returned_by_id?: string,
    ) {
        return this.mstService.findAll(page, pageSize, date_requested, returned_by_id);
    }

    @Query(() => [MST])
    msts_by_mst_number(
        @Args('mst_number') mst_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.mstService.findMstsByMstNumber(mst_number, is_detail_included);
    }

    @Query(() => MST)
    mst(
        @Args('id', { nullable: true }) id?: string,
        @Args('mst_number', { nullable: true }) mst_number?: string,
    ) {
        if (id) {
            return this.mstService.findBy({id});
        }
        if (mst_number) {
            return this.mstService.findBy({mst_number})
        }
    }

    @Mutation(() => MST)
    async updateMst(
        @Args('id') id: string,
        @Args('input') updateMstInput: UpdateMstInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mstService.setAuthUser(authUser)
        return await this.mstService.update(id, updateMstInput);
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelMst(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mstService.setAuthUser(authUser)
        return await this.mstService.cancel(id);
    }

    @ResolveField(() => Employee)
    returned_by(@Parent() mst: MST): any {
        return { __typename: 'Employee', id: mst.returned_by_id }
    }

    @ResolveField(() => [MSTApprover])
    mst_approvers(@Parent() mst: MST): any {
        return this.mstApproverService.findByMstId(mst.id)
    }

    @ResolveField(() => Int)
    async status(@Parent() mst: MST) {

        if (mst.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        return await this.mstService.getStatus(mst.id)

    }

    @ResolveField(() => Boolean)
    can_update(
        @Parent() mst: MST,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mstService.setAuthUser(authUser)
        return this.mstService.canUpdateForm(mst.id)
    }

}
