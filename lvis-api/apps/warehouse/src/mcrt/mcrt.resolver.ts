import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MCRT } from './entities/mcrt.entity';
import { CreateMcrtInput } from './dto/create-mcrt.input';
import { McrtService } from './mcrt.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { UpdateMcrtInput } from './dto/update-mcrt.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator'
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { MCRTApprover } from '../mcrt-approver/entities/mcrt-approver.entity';
import { McrtApproverService } from '../mcrt-approver/mcrt-approver.service';
import { MCRTsResponse } from './entities/mcrts-response.entity';
import { WarehouseCancelResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { APPROVAL_STATUS } from '../__common__/types';

@UseGuards(GqlAuthGuard)
@Resolver(() => MCRT)
export class McrtResolver {

    constructor(
        private readonly mcrtService: McrtService,
        private readonly mcrtApproverService: McrtApproverService
    ) { }

    @Mutation(() => MCRT)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MCRT, RESOLVERS.createMcrt)
    async createMcrt(
        @Args('input') createMcrtInput: CreateMcrtInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mcrtService.setAuthUser(authUser)
        return await this.mcrtService.create(createMcrtInput);
    }

    @Query(() => MCRTsResponse)
    mcrts(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
    ) {
        return this.mcrtService.findAll(page, pageSize, date_requested);
    }

    @Query(() => [MCRT])
    mcrts_by_mcrt_number(
        @Args('mcrt_number') mcrt_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.mcrtService.findMcrtsByMcrtNumber(mcrt_number, is_detail_included);
    }

    @Query(() => MCRT)
    mcrt(
        @Args('id', { nullable: true }) id?: string,
        @Args('mcrt_number', { nullable: true }) mcrt_number?: string,
    ) {
        if (id) {
            return this.mcrtService.findBy({id});
        }
        if (mcrt_number) {
            return this.mcrtService.findBy({mcrt_number})
        }
    }

    @Mutation(() => MCRT)
    async updateMcrt(
        @Args('id') id: string,
        @Args('input') updateMcrtInput: UpdateMcrtInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mcrtService.setAuthUser(authUser)
        return await this.mcrtService.update(id, updateMcrtInput);
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelMcrt(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mcrtService.setAuthUser(authUser)
        return await this.mcrtService.cancel(id);
    }

    @ResolveField(() => Employee)
    returned_by(@Parent() mcrt: MCRT): any {
        return { __typename: 'Employee', id: mcrt.returned_by_id }
    }

    @ResolveField(() => [MCRTApprover])
    mcrt_approvers(@Parent() mcrt: MCRT): any {
        return this.mcrtApproverService.findByMcrtId(mcrt.id)
    }

    @ResolveField(() => Int)
    async status(@Parent() mcrt: MCRT) {

        if (mcrt.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        return await this.mcrtService.getStatus(mcrt.id)

    }

    @ResolveField(() => Boolean)
    can_update(
        @Parent() mcrt: MCRT,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.mcrtService.setAuthUser(authUser)
        return this.mcrtService.canUpdateForm(mcrt.id)
    }

}
