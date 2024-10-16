import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { SERIV } from './entities/seriv.entity';
import { CreateSerivInput } from './dto/create-seriv.input';
import { SerivService } from './seriv.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { UpdateSerivInput } from './dto/update-seriv.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { SERIVApprover } from '../seriv-approver/entities/seriv-approver.entity';
import { SerivApproverService } from '../seriv-approver/seriv-approver.service';
import { SERIVsResponse } from './entities/serivs-response.entity';
import { APPROVAL_STATUS, MODULES, RESOLVERS } from '../__common__/types';
import { WarehouseCancelResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => SERIV)
export class SerivResolver {

    constructor(
        private readonly serivService: SerivService,
        private readonly serivApproverService: SerivApproverService
    ) { }

    @Mutation(() => SERIV)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.SERIV, RESOLVERS.createSeriv)
    async createSeriv(
        @Args('input') createSerivInput: CreateSerivInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.serivService.setAuthUser(authUser)
        return await this.serivService.create(createSerivInput);
    }

    @Query(() => SERIVsResponse)
    serivs(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
    ) {
        return this.serivService.findAll(page, pageSize, date_requested, requested_by_id);
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
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.serivService.setAuthUser(authUser)
        return await this.serivService.update(id, updateSerivInput);
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelSeriv(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.serivService.setAuthUser(authUser)
        return await this.serivService.cancel(id);
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
        return this.serivApproverService.findBySerivId(seriv.id)
    }

    @ResolveField(() => Int)
    async status(@Parent() seriv: SERIV) {

        if (seriv.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        return await this.serivService.getStatus(seriv.id)

    }

    @ResolveField(() => Boolean)
    can_update(
        @Parent() seriv: SERIV,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.serivService.setAuthUser(authUser)
        return this.serivService.canUpdateForm(seriv.id)
    }

}
