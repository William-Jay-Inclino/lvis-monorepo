import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PO } from './entities/po.entity';
import { CreatePoInput } from './dto/create-po.input';
import { PoService } from './po.service';
import { Employee } from '../__employee__/entities/employee.entity';
import { UpdatePoInput } from './dto/update-po.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { PoApproverService } from '../po-approver/po-approver.service';
import { PoNumber } from './entities/po-number.entity';
import { POsResponse } from './entities/pos-response.entity';
import { APPROVAL_STATUS, MODULES, RESOLVERS } from '../__common__/types';
import { POApprover } from '../po-approver/entities/po-approver.entity';
import { WarehouseCancelResponse, WarehouseRemoveResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { Account } from '../__account__ /entities/account.entity';
import { UpdatePoByFinanceManagerInput } from './dto/update-po-by-finance-manager.input';
import { MeqsService } from '../meqs/meqs.service';
import { MEQS } from '../meqs/entities/meq.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => PO)
export class PoResolver {

    constructor(
        private readonly poService: PoService,
        private readonly poApproverService: PoApproverService,
        private readonly meqsService: MeqsService,
    ) { }

    @Mutation(() => PO)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.PO, RESOLVERS.createPo)
    async createPo(
        @Args('input') createPoInput: CreatePoInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.poService.setAuthUser(authUser)
        return await this.poService.create(createPoInput);
    }

    @Query(() => POsResponse)
    pos(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date_requested', { nullable: true }) date_requested?: string,
        @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
    ) {
        return this.poService.findAll(page, pageSize, date_requested, requested_by_id);
    }

    @Query(() => [PO])
    pos_by_po_number(
        @Args('po_number') po_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.poService.findPOsByPoNumber(po_number, is_detail_included);
    }

    @Query(() => PO)
    po(
        @Args('id', { nullable: true }) id?: string | null,
        @Args('po_number', { nullable: true }) po_number?: string | null,
        @Args('meqs_number', { nullable: true }) meqs_number?: string | null,
    ) {
        if (id) {
            return this.poService.findOne(id);
        }
        if (po_number) {
            return this.poService.findByPoNumber(po_number)
        }
        if (meqs_number) {
            return this.poService.findByMeqsNumber(meqs_number)
        }
    }

    @Mutation(() => PO)
    async updatePo(
        @Args('id') id: string,
        @Args('input') updatePoInput: UpdatePoInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.poService.setAuthUser(authUser)
        return await this.poService.update(id, updatePoInput);
    }

    @Mutation(() => WarehouseRemoveResponse)
    async update_po_fund_source_and_po_approver(
        @Args('id') id: string,
        @Args('input') input: UpdatePoByFinanceManagerInput,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.poService.setAuthUser(authUser)
        return await this.poService.updateFundSourceByFinanceManager(id, input);
    }

    @Mutation(() => WarehouseCancelResponse)
    async cancelPo(
        @Args('id') id: string,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.poService.setAuthUser(authUser)
        return await this.poService.cancel(id);
    }

    @ResolveField(() => [POApprover])
    po_approvers(@Parent() po: PO): any {
        return this.poApproverService.findByPoId(po.id)
    }

    @ResolveField(() => Int)
    async status(@Parent() po: PO) {

        if (po.cancelled_at) {
            return APPROVAL_STATUS.CANCELLED
        }

        return await this.poService.getStatus(po.id)

    }

    @ResolveField(() => Employee)
    async requested_by(@Parent() po: PO) {

        const meqs = await this.meqsService.findByMeqsNumber(po.meqs_number) as unknown as MEQS
        
        if(!meqs) {
            throw new NotFoundException(`meqs number: ${po.meqs_number} not found in meqs table`)
        }

        if(meqs.rv) {
            return { __typename: 'Employee', id: meqs.rv.canvass.requested_by_id }
        }

        if(meqs.spr) {
            return { __typename: 'Employee', id: meqs.spr.canvass.requested_by_id }
        }

        if(meqs.jo) {
            return { __typename: 'Employee', id: meqs.jo.canvass.requested_by_id }
        }

    }

    @ResolveField(() => Account, { nullable: true })
    fund_source(@Parent() po: PO): any {

        console.log('fund_source()')
        if (!po.fund_source_id) {
            return null
        }

        return { __typename: 'Account', id: po.fund_source_id }
    }

    @ResolveField(() => Boolean)
    can_update(
        @Parent() po: PO,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.poService.setAuthUser(authUser)
        return this.poService.canUpdateForm(po.id)
    }

}
