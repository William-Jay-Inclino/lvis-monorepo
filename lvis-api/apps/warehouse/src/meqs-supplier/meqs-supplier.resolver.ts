import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { MeqsSupplierService } from './meqs-supplier.service';
import { MeqsSupplier } from './entities/meqs-supplier.entity';
import { CreateMeqsSupplierInput } from './dto/create-meqs-supplier.input';
import { UpdateMeqsSupplierInput } from './dto/update-meqs-supplier.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => MeqsSupplier)
export class MeqsSupplierResolver {

  private readonly logger = new Logger(MeqsSupplierResolver.name);
  private filename = 'meqs-supplier.resolver.ts'

  constructor(
    private readonly meqsSupplierService: MeqsSupplierService,
    private readonly audit: WarehouseAuditService,
  ) { }

  @Mutation(() => MeqsSupplier)
  async createMeqsSupplier(
    @Args('input') createMeqsSupplierInput: CreateMeqsSupplierInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Creating supplier in MEQS...', {
      username: authUser.user.username,
      filename: this.filename,
      input: JSON.stringify(createMeqsSupplierInput)
    })

    try {

      const x = await this.meqsSupplierService.create(createMeqsSupplierInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser,
      });
      
      this.logger.log('Meqs Supplier created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating Meqs Supplier', error)
    }
  }

  @Query(() => MeqsSupplier)
  meqs_supplier(@Args('id') id: string) {
    return this.meqsSupplierService.findOne(id);
  }

  @Mutation(() => MeqsSupplier)
  async updateMeqsSupplier(
    @Args('id') id: string,
    @Args('input') updateMeqsSupplierInput: UpdateMeqsSupplierInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Updating supplier in MEQS...', {
      username: authUser.user.username,
      filename: this.filename,
      meqs_supplier_id: id,
      input: JSON.stringify(updateMeqsSupplierInput),
    })

    try {

      const x = await this.meqsSupplierService.update(id, updateMeqsSupplierInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser,
      });

      this.logger.log('MEQS Supplier updated successfully')

      return x
  } catch (error) {
      this.logger.error('Error in updating MEQS Supplier', error)
  }
  }

  @Mutation(() => WarehouseRemoveResponse)
  async removeMeqsSupplier(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

      this.logger.log('Removing supplier in MEQS...', {
        username: authUser.user.username,
        filename: this.filename,
        meqs_supplier_id: id,
      })

      try {
        const x = await this.meqsSupplierService.remove(id, {
          ip_address,
          device_info: this.audit.getDeviceInfo(user_agent),
          authUser,
        });
        
        this.logger.log('MEQS Supplier cancelled successfully')
        
        return x 

    } catch (error) {
        this.logger.error('Error in removing MEQS Supplier', error)
    }

  }

  @ResolveField(() => Boolean)
  async is_referenced(@Parent() meqsSupplier: MeqsSupplier) {
    return await this.meqsSupplierService.isReferenced(meqsSupplier.id)
  }


}
