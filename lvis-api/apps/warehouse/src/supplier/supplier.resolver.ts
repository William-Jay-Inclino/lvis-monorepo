import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SupplierService } from './supplier.service';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { SuppliersResponse } from './entities/suppliers-response.entity';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Supplier)
export class SupplierResolver {

  private readonly logger = new Logger(SupplierResolver.name);
  private filename = 'supplier.resolver.ts'

  constructor(
    private readonly supplierService: SupplierService,
    private readonly audit: WarehouseAuditService,
  ) { }

  @Mutation(() => Supplier)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.SUPPLIER, RESOLVERS.createSupplier)
  async createSupplier(
    @Args('input') createSupplierInput: CreateSupplierInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {
    this.logger.log('Creating Supplier...', {
      username: authUser.user.username,
      filename: this.filename,
      input: JSON.stringify(createSupplierInput)
    })

    try {
      
      const x = await this.supplierService.create(createSupplierInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent), 
        authUser,
      });
      
      this.logger.log('Supplier created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating Supplier', error)
    }
  }

  @Query(() => SuppliersResponse)
  suppliers(
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
    @Args('name', { nullable: true }) name?: string,
  ) {
    return this.supplierService.findAll(page, pageSize, name);
  }

  @Query(() => Supplier)
  supplier(@Args('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Query(() => [Supplier])
  suppliersByName(
    @Args('input') input: string,
  ) {
    return this.supplierService.findItemsByName(input)
  }

  @Mutation(() => Supplier)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.SUPPLIER, RESOLVERS.updateSupplier)
  async updateSupplier(
    @Args('id') id: string,
    @Args('input') updateSupplierInput: UpdateSupplierInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {
    this.logger.log('Updating supplier...', {
      username: authUser.user.username,
      filename: this.filename,
      supplier_id: id,
      input: JSON.stringify(updateSupplierInput),
    })
    try {
      
      const x = await this.supplierService.update(id, updateSupplierInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent), 
        authUser,
      });

      this.logger.log('Supplier updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating Supplier', error)
    }
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.SUPPLIER, RESOLVERS.removeSupplier)
  async removeSupplier(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {
    this.logger.log('Removing supplier...', {
      username: authUser.user.username,
      filename: this.filename,
      supplier_id: id,
    })
    try {
      const x = await this.supplierService.remove(id, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent), 
        authUser,
      });
      
      this.logger.log('Supplier removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing Supplier', error)
    }
  }

}
