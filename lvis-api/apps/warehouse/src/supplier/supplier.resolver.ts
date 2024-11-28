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

@UseGuards(GqlAuthGuard)
@Resolver(() => Supplier)
export class SupplierResolver {

  private readonly logger = new Logger(SupplierResolver.name);
  private filename = 'supplier.resolver.ts'

  constructor(private readonly supplierService: SupplierService) { }

  @Mutation(() => Supplier)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.SUPPLIER, RESOLVERS.createSupplier)
  async createSupplier(
    @Args('input') createSupplierInput: CreateSupplierInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.createSupplier,
        input: JSON.stringify(createSupplierInput)
      })
      
      this.supplierService.setAuthUser(authUser)

      const x = await this.supplierService.create(createSupplierInput);
      
      this.logger.log('Supplier created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating Supplier', error)
    }
  }

  @Query(() => [Supplier])
  suppliers() {
    return this.supplierService.findAll();
  }

  @Query(() => Supplier)
  supplier(@Args('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Mutation(() => Supplier)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.SUPPLIER, RESOLVERS.updateSupplier)
  async updateSupplier(
    @Args('id') id: string,
    @Args('input') updateSupplierInput: UpdateSupplierInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.updateSupplier,
        supplier_id: id,
        input: JSON.stringify(updateSupplierInput),
      })
      
      this.supplierService.setAuthUser(authUser)
      const x = await this.supplierService.update(id, updateSupplierInput);

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
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.removeSupplier,
        supplier_id: id,
      })

      this.supplierService.setAuthUser(authUser)
      const x = await this.supplierService.remove(id);
      
      this.logger.log('Supplier removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing Supplier', error)
    }
  }

}
