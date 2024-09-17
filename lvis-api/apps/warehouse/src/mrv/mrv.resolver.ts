import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MRV } from './entities/mrv.entity';
import { CreateMrvInput } from './dto/create-mrv.input';
import { MrvService } from './mrv.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { UpdateMrvInput } from './dto/update-mrv.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { MRVApprover } from '../mrv-approver/entities/mrv-approver.entity';
import { MrvApproverService } from '../mrv-approver/mrv-approver.service';
import { MRVsResponse } from './entities/mrvs-response.entity';
import { APPROVAL_STATUS, MODULES, RESOLVERS } from '../__common__/types';
import { WarehouseCancelResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => MRV)
export class MrvResolver {

    constructor(
        private readonly mrvService: MrvService,
        private readonly mrvApproverService: MrvApproverService
    ) { }

    @Mutation(() => MRV)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MRV, RESOLVERS.createMrv)
    async createMrv(
        @Args('input') createMrvInput: CreateMrvInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mrvService.setAuthUser(authUser)
        return await this.mrvService.create(createMrvInput);
    }

    @Query(() => MRVsResponse)
    mrvs(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
    ) {
        return this.mrvService.findAll(page, pageSize, date_requested, requested_by_id);
    }

    @Query(() => [MRV])
    mrvs_by_mrv_number(
        @Args('mrv_number') mrv_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.mrvService.findMrvsByMrvNumber(mrv_number, is_detail_included);
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
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mrvService.setAuthUser(authUser)
        return await this.mrvService.update(id, updateMrvInput);
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelMrv(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mrvService.setAuthUser(authUser)
        return await this.mrvService.cancel(id);
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
        return this.mrvApproverService.findByMrvId(mrv.id)
    }

    @ResolveField(() => Int)
    async status(@Parent() mrv: MRV) {

        if (mrv.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        return await this.mrvService.getStatus(mrv.id)

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
