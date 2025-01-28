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
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => MeqsSupplierAttachment)
export class MeqsSupplierAttachmentResolver {

  private readonly logger = new Logger(MeqsSupplierAttachmentResolver.name);
  private filename = 'meqs-supplier-attachment.resolver.ts'
  
  constructor(
    private readonly meqsSupplierAttachmentService: MeqsSupplierAttachmentService,
    private readonly audit: WarehouseAuditService,
  ) { }

  @Mutation(() => MeqsSupplierAttachment)
  async createMeqsSupplierAttachment(
    @Args('input') createMeqsSupplierAttachmentInput: CreateMeqsSupplierAttachmentInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Adding attachment in MEQS supplier...', {
      username: authUser.user.username,
      filename: this.filename,
      input: JSON.stringify(createMeqsSupplierAttachmentInput)
    })

    try {
      
      this.meqsSupplierAttachmentService.setAuthUser(authUser)

      const x = await this.meqsSupplierAttachmentService.create(createMeqsSupplierAttachmentInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });
      
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
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Updating attachment in MEQS supplier...', {
      username: authUser.user.username,
      filename: this.filename,
      meqs_supplier_attachment_id: id,
      input: JSON.stringify(updateMeqsSupplierAttachmentInput),
    })

    try {
      
      this.meqsSupplierAttachmentService.setAuthUser(authUser)
      const x = await this.meqsSupplierAttachmentService.update(id, updateMeqsSupplierAttachmentInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });

      this.logger.log('MEQS Supplier Attachment updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating MEQS Supplier Attachment', error)
    }

  }

  @Mutation(() => WarehouseRemoveResponse)
  async removeMeqsSupplierAttachment(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Removing attachment in MEQS supplier...', {
      username: authUser.user.username,
      filename: this.filename,
      meqs_supplier_attachment_id: id,
    })
    try {

      this.meqsSupplierAttachmentService.setAuthUser(authUser)
      const x = await this.meqsSupplierAttachmentService.remove(id, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });
      
      this.logger.log('MEQS Supplier Attachment removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing MEQS Supplier Attachment', error)
    }
  }
}
