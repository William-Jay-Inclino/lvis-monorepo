import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MeqsSupplierAttachmentService } from './meqs-supplier-attachment.service';
import { MeqsSupplierAttachment } from './entities/meqs-supplier-attachment.entity';
import { CreateMeqsSupplierAttachmentInput } from './dto/create-meqs-supplier-attachment.input';
import { UpdateMeqsSupplierAttachmentInput } from './dto/update-meqs-supplier-attachment.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => MeqsSupplierAttachment)
export class MeqsSupplierAttachmentResolver {
  constructor(private readonly meqsSupplierAttachmentService: MeqsSupplierAttachmentService) { }

  @Mutation(() => MeqsSupplierAttachment)
  createMeqsSupplierAttachment(
    @Args('input') createMeqsSupplierAttachmentInput: CreateMeqsSupplierAttachmentInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.meqsSupplierAttachmentService.setAuthUser(authUser)
    return this.meqsSupplierAttachmentService.create(createMeqsSupplierAttachmentInput);
  }


  @Query(() => MeqsSupplierAttachment)
  meqsSupplierAttachment(@Args('id') id: string) {
    return this.meqsSupplierAttachmentService.findOne(id);
  }

  @Mutation(() => MeqsSupplierAttachment)
  updateMeqsSupplierAttachment(
    @Args('id') id: string,
    @Args('input') updateMeqsSupplierAttachmentInput: UpdateMeqsSupplierAttachmentInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.meqsSupplierAttachmentService.setAuthUser(authUser)
    return this.meqsSupplierAttachmentService.update(id, updateMeqsSupplierAttachmentInput);
  }

  @Mutation(() => WarehouseRemoveResponse)
  removeMeqsSupplierAttachment(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.meqsSupplierAttachmentService.setAuthUser(authUser)
    return this.meqsSupplierAttachmentService.remove(id);
  }
}
