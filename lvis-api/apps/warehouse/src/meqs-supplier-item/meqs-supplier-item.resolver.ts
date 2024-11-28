import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MeqsSupplierItemService } from './meqs-supplier-item.service';
import { MeqsSupplierItem } from './entities/meqs-supplier-item.entity';
import { CreateMeqsSupplierItemInput } from './dto/create-meqs-supplier-item.input';
import { UpdateMeqsSupplierItemInput } from './dto/update-meqs-supplier-item.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MeqsSupplierItem)
export class MeqsSupplierItemResolver {

  private readonly logger = new Logger(MeqsSupplierItemResolver.name);
  private filename = 'account.resolver.ts'
  
  constructor(private readonly meqsSupplierItemService: MeqsSupplierItemService) { }

  @Mutation(() => MeqsSupplierItem)
  async createMeqsSupplierItem(
    @Args('input') createMeqsSupplierItemInput: CreateMeqsSupplierItemInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'createMeqsSupplierItem',
        input: JSON.stringify(createMeqsSupplierItemInput)
      })
      
      this.meqsSupplierItemService.setAuthUser(authUser)

      const x = await this.meqsSupplierItemService.create(createMeqsSupplierItemInput);
      
      this.logger.log('MEQS Supplier Item created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating MEQS Supplier Item', error)
    }

  }

  @Query(() => MeqsSupplierItem)
  meqs_supplier_item(@Args('id') id: string) {
    return this.meqsSupplierItemService.findOne(id);
  }

  @Mutation(() => MeqsSupplierItem)
  async updateMeqsSupplierItem(
    @Args('id') id: string,
    @Args('input') updateMeqsSupplierItemInput: UpdateMeqsSupplierItemInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'updateMeqsSupplierItem',
        meqs_supplier_item_id: id,
        input: JSON.stringify(updateMeqsSupplierItemInput),
      })
      
      this.meqsSupplierItemService.setAuthUser(authUser)
      const x = await this.meqsSupplierItemService.update(id, updateMeqsSupplierItemInput);

      this.logger.log('MEQS Supplier Item updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating MEQS Supplier Item', error)
    }

  }

  @Mutation(() => MeqsSupplierItem)
  async removeMeqsSupplierItem(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'removeMeqsSupplierItem',
        meqs_supplier_item_id: id,
      })

      this.meqsSupplierItemService.setAuthUser(authUser)
      const x = await this.meqsSupplierItemService.remove(id);
      
      this.logger.log('MEQS Supplier Item removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing MEQS Supplier Item', error)
    }

  }

  @Mutation(() => WarehouseRemoveResponse)
  async awardMeqsSupplierItem(
    @Args('id') id: string,
    @Args('meqs_supplier_id') meqs_supplier_id: string,
    @Args('canvass_item_id') canvass_item_id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'awardMeqsSupplierItem',
        meqs_supplier_item_id: id,
        meqs_supplier_id: meqs_supplier_id,
        canvass_item_id: canvass_item_id,
      })

      this.meqsSupplierItemService.setAuthUser(authUser)
      const x = await this.meqsSupplierItemService.awardSupplier(id, meqs_supplier_id, canvass_item_id);
      
      this.logger.log('MEQS Supplier Item awarded successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in awarding MEQS Supplier Item', error)
    }

  }

  @Mutation(() => WarehouseRemoveResponse)
  async attachNoteMeqsSupplierItem(
    @Args('meqs_id') meqs_id: string,
    @Args('canvass_item_id') canvass_item_id: string,
    @Args('notes') notes: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'attachNoteMeqsSupplierItem',
        meqs_id: meqs_id,
        canvass_item_id: canvass_item_id,
        notes: notes,
      })

      this.meqsSupplierItemService.setAuthUser(authUser)
      const x = await this.meqsSupplierItemService.attachNote(meqs_id, canvass_item_id, notes);
      
      this.logger.log('MEQS Supplier Item attached note successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in attaching note of MEQS Supplier Item', error)
    }

  }

}
