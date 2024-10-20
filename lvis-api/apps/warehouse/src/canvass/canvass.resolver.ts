import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Canvass } from './entities/canvass.entity';
import { CanvassService } from './canvass.service';
import { CreateCanvassInput } from './dto/create-canvass.input';
import { Employee } from '../__employee__/entities/employee.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthUser } from '../__common__/auth-user.entity';
import { UpdateCanvassInput } from './dto/update-canvass.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { CanvassesResponse } from './entities/canvasses-response.entity';
import { RcNumber } from './entities/rc-number.entity'
import { MODULES, RESOLVERS } from '../__common__/types';
import { AccessGuard } from '../__auth__/guards/access.guard';


@UseGuards(GqlAuthGuard)
@Resolver(() => Canvass)
export class CanvassResolver {

  constructor(private readonly canvassService: CanvassService) { }

  @Mutation(() => Canvass)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.CANVASS, RESOLVERS.createCanvass)
  async createCanvass(
    @Args('input') createCanvassInput: CreateCanvassInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.canvassService.setAuthUser(authUser)
    return await this.canvassService.create(createCanvassInput)
  }

  @Query(() => CanvassesResponse)
  canvasses(
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
    @Args('date_requested', { nullable: true }) date_requested?: string,
    @Args('requested_by_id', { nullable: true }) requested_by_id?: string,
  ) {
    return this.canvassService.findAll(page, pageSize, date_requested, requested_by_id);
  }

  @Query(() => [Canvass])
  canvasses_by_rc_number(
    @Args('rc_number') rc_number: string,
    @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
  ) {
    return this.canvassService.findCanvassesByRcNumber(rc_number, is_detail_included);
  }

  @Query(() => Canvass)
  canvass(
    @Args('id', { nullable: true }) id?: string,
    @Args('rc_number', { nullable: true }) rc_number?: string
  ) {
    if (id) {
      return this.canvassService.findOne(id);
    }
    if (rc_number) {
      return this.canvassService.findByRcNumber(rc_number)
    }
  }

  @Mutation(() => Canvass)
  async updateCanvass(
    @Args('id') id: string,
    @Args('input') updateCanvassInput: UpdateCanvassInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.canvassService.setAuthUser(authUser)
    return await this.canvassService.update(id, updateCanvassInput);
  }

  @Mutation(() => WarehouseRemoveResponse)
  removeCanvass(
    @Args('id', { type: () => String }) id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.canvassService.setAuthUser(authUser)
    return this.canvassService.remove(id);
  }

  @ResolveField(() => Employee)
  requested_by(@Parent() canvass: Canvass): any {
    return { __typename: 'Employee', id: canvass.requested_by_id }
  }

  @ResolveField(() => Boolean)
  can_update(
    @Parent() canvass: Canvass,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.canvassService.setAuthUser(authUser)
    return this.canvassService.canUpdate(canvass.id)
  }

  @ResolveField(() => Boolean)
  async is_referenced(@Parent() canvass: Canvass) {
    return await this.canvassService.isReferenced(canvass.id)
  }

  @ResolveField(() => Boolean)
  async is_reference_in_rr(@Parent() canvass: Canvass) {
    return await this.canvassService.isReferencedInRR(canvass.id)
  }

}
