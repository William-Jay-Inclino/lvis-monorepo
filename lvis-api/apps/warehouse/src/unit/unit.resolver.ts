import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UnitService } from './unit.service';
import { Unit } from './entities/unit.entity';
import { CreateUnitInput } from './dto/create-unit.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UpdateUnitInput } from './dto/update-unit.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => Unit)
export class UnitResolver {

  private readonly logger = new Logger(UnitResolver.name);
  private filename = 'project.resolver.ts'

  constructor(
    private readonly unitService: UnitService,
    private readonly audit: WarehouseAuditService,
  ) { }

  @Mutation(() => Unit)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.UNIT, RESOLVERS.createUnit)
  async createUnit(
    @Args('input') createUnitInput: CreateUnitInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    try {
      
      this.unitService.setAuthUser(authUser)
  
      console.log('user_agent', user_agent);
      console.log('ip_address', ip_address);

      this.logger.log('user_agent', user_agent)
      this.logger.log('ip_address', ip_address)
  
      return await this.unitService.create(createUnitInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });

    } catch (error) {
      this.logger.error('Error in creating unit', error)
    }

  }

  @Query(() => [Unit])
  units() {
    return this.unitService.findAll();
  }

  @Query(() => Unit)
  unit(@Args('id') id: string) {
    return this.unitService.findOne(id);
  }

  @Mutation(() => Unit)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.UNIT, RESOLVERS.updateUnit)
  updateUnit(
    @Args('id') id: string,
    @Args('input') updateUnitInput: UpdateUnitInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {
    this.unitService.setAuthUser(authUser)
    return this.unitService.update(id, updateUnitInput, {
      ip_address,
      device_info: this.audit.getDeviceInfo(user_agent)
    });
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.UNIT, RESOLVERS.removeUnit)
  removeUnit(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {
    this.unitService.setAuthUser(authUser)
    return this.unitService.remove(id, {
      ip_address,
      device_info: this.audit.getDeviceInfo(user_agent)
    });
  }

}
