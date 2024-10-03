import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { OSRIV } from './entities/osriv.entity';
import { CreateOsrivInput } from './dto/create-osriv.input';
import { OsrivService } from './osriv.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { UpdateOsrivInput } from './dto/update-osriv.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { OSRIVApprover } from '../osriv-approver/entities/osriv-approver.entity';
import { OsrivApproverService } from '../osriv-approver/osriv-approver.service';
import { OSRIVsResponse } from './entities/osrivs-response.entity';
import { APPROVAL_STATUS, MODULES, RESOLVERS } from '../__common__/types';
import { WarehouseCancelResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => OSRIV)
export class OsrivResolver {

    constructor(
        private readonly osrivService: OsrivService,
        private readonly osrivApproverService: OsrivApproverService
    ) { }

    @Mutation(() => OSRIV)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.OSRIV, RESOLVERS.createOsriv)
    async createOsriv(
        @Args('input') createOsrivInput: CreateOsrivInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.osrivService.setAuthUser(authUser)
        return await this.osrivService.create(createOsrivInput);
    }

    @Query(() => OSRIVsResponse)
    osrivs(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
    ) {
        return this.osrivService.findAll(page, pageSize, date_requested, requested_by_id);
    }

    @Query(() => [OSRIV])
    osrivs_by_osriv_number(
        @Args('osriv_number') osriv_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.osrivService.findOsrivsByOsrivNumber(osriv_number, is_detail_included);
    }

    @Query(() => OSRIV)
    osriv(
        @Args('id', { nullable: true }) id?: string,
        @Args('osriv_number', { nullable: true }) osriv_number?: string,
    ) {
        if (id) {
            return this.osrivService.findBy({id});
        }
        if (osriv_number) {
            return this.osrivService.findBy({osriv_number})
        }
    }

    @Mutation(() => OSRIV)
    async updateOsriv(
        @Args('id') id: string,
        @Args('input') updateOsrivInput: UpdateOsrivInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.osrivService.setAuthUser(authUser)
        return await this.osrivService.update(id, updateOsrivInput);
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelOsriv(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.osrivService.setAuthUser(authUser)
        return await this.osrivService.cancel(id);
    }

    @ResolveField(() => Employee)
    requested_by(@Parent() osriv: OSRIV): any {
        return { __typename: 'Employee', id: osriv.requested_by_id }
    }

    // @ResolveField(() => Department)
    // department(@Parent() osriv: OSRIV): any {
    //     console.log('department', osriv);
    //     return { __typename: 'Department', id: osriv.department_id }
    // }

    @ResolveField(() => [OSRIVApprover])
    osriv_approvers(@Parent() osriv: OSRIV): any {
        return this.osrivApproverService.findByOsrivId(osriv.id)
    }

    @ResolveField(() => Int)
    async status(@Parent() osriv: OSRIV) {

        if (osriv.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        return await this.osrivService.getStatus(osriv.id)

    }

    @ResolveField(() => Boolean)
    can_update(
        @Parent() osriv: OSRIV,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.osrivService.setAuthUser(authUser)
        return this.osrivService.canUpdateForm(osriv.id)
    }

}
