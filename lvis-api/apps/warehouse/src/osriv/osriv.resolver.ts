import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { OSRIV } from './entities/osriv.entity';
import { CreateOsrivInput } from './dto/create-osriv.input';
import { OsrivService } from './osriv.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { UpdateOsrivInput } from './dto/update-osriv.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { OSRIVApprover } from '../osriv-approver/entities/osriv-approver.entity';
import { OsrivApproverService } from '../osriv-approver/osriv-approver.service';
import { OSRIVsResponse } from './entities/osrivs-response.entity';
import { WarehouseCancelResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { APPROVAL_STATUS } from '../__common__/types';

@UseGuards(GqlAuthGuard)
@Resolver(() => OSRIV)
export class OsrivResolver {

    private readonly logger = new Logger(OsrivResolver.name);
    private filename = 'osriv.resolver.ts'

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

        try {
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.createOsriv,
              input: JSON.stringify(CreateOsrivInput)
            })
            
            this.osrivService.setAuthUser(authUser)
      
            const x = await this.osrivService.create(createOsrivInput);
            
            this.logger.log('OSRIV created successfully')
      
            return x
      
        } catch (error) {
            this.logger.error('Error in creating OSRIV', error)
        }

    }

    @Query(() => OSRIVsResponse)
    osrivs(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
        @Args('approval_status', { nullable: true }) approval_status?: number
    ) {
        return this.osrivService.findAll(page, pageSize, date_requested, requested_by_id, approval_status);
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

        try {
      
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.updateOsriv,
              osriv_id: id,
              input: JSON.stringify(updateOsrivInput),
            })
            
            this.osrivService.setAuthUser(authUser)
            const x = await this.osrivService.update(id, updateOsrivInput);
      
            this.logger.log('OSRIV updated successfully')
      
            return x
        } catch (error) {
            this.logger.error('Error in updating OSRIV', error)
        }

    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelOsriv(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser
    ) {

        try {

            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: 'cancelOsriv',
              osriv_id: id,
            })
      
            this.osrivService.setAuthUser(authUser)
            const x = await this.osrivService.cancel(id);
            
            this.logger.log('OSRIV cancelled successfully')
            
            return x 
      
        } catch (error) {
            this.logger.error('Error in cancelling OSRIV', error)
        }
    }

    @ResolveField(() => Employee)
    requested_by(@Parent() osriv: OSRIV): any {
        return { __typename: 'Employee', id: osriv.requested_by_id }
    }

    @ResolveField(() => [OSRIVApprover])
    osriv_approvers(@Parent() osriv: OSRIV): any {
        return this.osrivApproverService.findByOsrivId(osriv.id, osriv.osriv_number)
    }

    @ResolveField(() => Int)
    async status(@Parent() osriv: OSRIV) {

        if (osriv.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        if(osriv.approval_status) {
            return osriv.approval_status
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
