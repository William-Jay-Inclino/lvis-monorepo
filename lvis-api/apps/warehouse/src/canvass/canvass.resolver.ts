import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Canvass } from './entities/canvass.entity';
import { CanvassService } from './canvass.service';
import { CreateCanvassInput } from './dto/create-canvass.input';
import { Employee } from '../__employee__/entities/employee.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { UpdateCanvassInput } from './dto/update-canvass.input';
import { CanvassesResponse } from './entities/canvasses-response.entity';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';


@UseGuards(GqlAuthGuard)
@Resolver(() => Canvass)
export class CanvassResolver {

    private readonly logger = new Logger(CanvassResolver.name);
    private filename = 'canvass.resolver.ts'

  constructor(
    private readonly canvassService: CanvassService,
    private readonly audit: WarehouseAuditService,
  ) { }

  @Mutation(() => Canvass)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.CANVASS, RESOLVERS.createCanvass)
  async createCanvass(
    @Args('input') createCanvassInput: CreateCanvassInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.createCanvass,
        input: JSON.stringify(createCanvassInput)
      })
      
      this.canvassService.setAuthUser(authUser)

      const x = await this.canvassService.create(createCanvassInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });
      
      this.logger.log('Canvass created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating canvass', error)
    }

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
  async canvass(
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
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.updateCanvass,
        canvass_id: id,
        input: JSON.stringify(updateCanvassInput),
      })
      
      this.canvassService.setAuthUser(authUser)
      const x = await this.canvassService.update(id, updateCanvassInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });

      this.logger.log('Canvass updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating canvass', error)
    }

  }

  // @Mutation(() => WarehouseRemoveResponse)
  // async removeCanvass(
  //   @Args('id', { type: () => String }) id: string,
  //   @CurrentAuthUser() authUser: AuthUser,
  //   @UserAgent() user_agent: string,
  //   @IpAddress() ip_address: string,
  // ) {

  //   try {

  //     this.logger.log({
  //       username: authUser.user.username,
  //       filename: this.filename,
  //       function: RESOLVERS.removeCanvass,
  //       canvass_id: id,
  //     })

  //     this.canvassService.setAuthUser(authUser)
  //     const x = await this.canvassService.remove(id);
      
  //     this.logger.log('Canvass removed successfully')
      
  //     return x 

  //   } catch (error) {
  //     this.logger.error('Error in removing canvass', error)
  //   }

  // }

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
