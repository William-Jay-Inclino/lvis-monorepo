import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MCRT } from './entities/mcrt.entity';
import { CreateMcrtInput } from './dto/create-mcrt.input';
import { McrtService } from './mcrt.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { UpdateMcrtInput } from './dto/update-mcrt.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator'
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
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

    private readonly logger = new Logger(McrtResolver.name);
    private filename = 'mcrt.resolver.ts'

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
        try {
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.createMcrt,
              input: JSON.stringify(createMcrtInput)
            })
            
            this.mcrtService.setAuthUser(authUser)
      
            const x = await this.mcrtService.create(createMcrtInput);
            
            this.logger.log('MCRT created successfully')
      
            return x
      
          } catch (error) {
            this.logger.error('Error in creating MCRT', error)
          }
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
        try {
      
            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: RESOLVERS.updateMcrt,
              mcrt_id: id,
              input: JSON.stringify(updateMcrtInput),
            })
            
            this.mcrtService.setAuthUser(authUser)
            const x = await this.mcrtService.update(id, updateMcrtInput);
      
            this.logger.log('MCRT updated successfully')
      
            return x
          } catch (error) {
            this.logger.error('Error in updating MCRT', error)
          }
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelMcrt(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        try {

            this.logger.log({
              username: authUser.user.username,
              filename: this.filename,
              function: 'cancelMcrt',
              mcrt_id: id,
            })
      
            this.mcrtService.setAuthUser(authUser)
            const x = await this.mcrtService.cancel(id);
            
            this.logger.log('MCRT cancelled successfully')
            
            return x 
      
        } catch (error) {
            this.logger.error('Error in cancelling MCRT', error)
        }
    }

    @ResolveField(() => Employee)
    returned_by(@Parent() mcrt: MCRT): any {
        return { __typename: 'Employee', id: mcrt.returned_by_id }
    }

    @ResolveField(() => [MCRTApprover])
    mcrt_approvers(@Parent() mcrt: MCRT): any {
        return this.mcrtApproverService.findByMcrtId(mcrt.id, mcrt.mcrt_number)
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
