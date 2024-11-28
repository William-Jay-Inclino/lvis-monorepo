import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MeqsSupplierAttachmentService } from './meqs-supplier-attachment.service';
import { MeqsSupplierAttachment } from './entities/meqs-supplier-attachment.entity';
import { CreateMeqsSupplierAttachmentInput } from './dto/create-meqs-supplier-attachment.input';
import { UpdateMeqsSupplierAttachmentInput } from './dto/update-meqs-supplier-attachment.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MeqsSupplierAttachment)
export class MeqsSupplierAttachmentResolver {

  private readonly logger = new Logger(MeqsSupplierAttachmentResolver.name);
  private filename = 'meqs-supplier-attachment.resolver.ts'
  
  constructor(private readonly meqsSupplierAttachmentService: MeqsSupplierAttachmentService) { }

  @Mutation(() => MeqsSupplierAttachment)
  async createMeqsSupplierAttachment(
    @Args('input') createMeqsSupplierAttachmentInput: CreateMeqsSupplierAttachmentInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'createMeqsSupplierAttachment',
        input: JSON.stringify(createMeqsSupplierAttachmentInput)
      })
      
      this.meqsSupplierAttachmentService.setAuthUser(authUser)

      const x = await this.meqsSupplierAttachmentService.create(createMeqsSupplierAttachmentInput);
      
      this.logger.log('MEQS Supplier Attachment created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating MEQS Supplier Attachment', error)
    }

  }


  @Query(() => MeqsSupplierAttachment)
  meqsSupplierAttachment(@Args('id') id: string) {
    return this.meqsSupplierAttachmentService.findOne(id);
  }

  @Mutation(() => MeqsSupplierAttachment)
  async updateMeqsSupplierAttachment(
    @Args('id') id: string,
    @Args('input') updateMeqsSupplierAttachmentInput: UpdateMeqsSupplierAttachmentInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'updateMeqsSupplierAttachment',
        meqs_supplier_attachment_id: id,
        input: JSON.stringify(updateMeqsSupplierAttachmentInput),
      })
      
      this.meqsSupplierAttachmentService.setAuthUser(authUser)
      const x = await this.meqsSupplierAttachmentService.update(id, updateMeqsSupplierAttachmentInput);

      this.logger.log('MEQS Supplier Attachment updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating MEQS Supplier Attachment', error)
    }

  }

  @Mutation(() => WarehouseRemoveResponse)
  async removeMeqsSupplierAttachment(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'removeMeqsSupplierAttachment',
        meqs_supplier_attachment_id: id,
      })

      this.meqsSupplierAttachmentService.setAuthUser(authUser)
      const x = await this.meqsSupplierAttachmentService.remove(id);
      
      this.logger.log('MEQS Supplier Attachment removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing MEQS Supplier Attachment', error)
    }
  }
}
