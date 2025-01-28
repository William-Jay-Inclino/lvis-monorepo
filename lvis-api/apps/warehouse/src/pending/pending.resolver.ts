import { Resolver, Args, Mutation, Int } from '@nestjs/graphql';
import { PendingService } from './pending.service';
import { Pending } from './entities/pending.entity';
import { PendingResponse } from './entities/pending-response.entity';
import { APPROVAL_STATUS } from '../__common__/types';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { UpdateApproverNotesInput } from './entities/update-approver-notes.input';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => Pending)
export class PendingResolver {

    private readonly logger = new Logger(PendingResolver.name);
    private filename = 'pending.resolver.ts'

  constructor(
    private readonly pendingService: PendingService,
    private readonly audit: WarehouseAuditService,
  ) {}

  @Mutation(() => PendingResponse)
  async approve_pending(
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
    @Args('id', { type: () => Int }) id: number,
    @Args('remarks', { type: () => String }) remarks: string,
    @Args('classification_id', { type: () => String, nullable: true }) classification_id?: string | null,
    @Args('fund_source_id', { type: () => String, nullable: true }) fund_source_id?: string | null,
  ) {

    this.logger.log('Approving pending...', {
      username: authUser.user.username,
      filename: this.filename,
      pending_id: id,
      remarks,
      classification_id,
      fund_source_id,
    })

    try {
        
        this.pendingService.setAuthUser(authUser)

        const x = await this.pendingService.approveOrDisapprovePending({
          id,
          status: APPROVAL_STATUS.APPROVED,
          remarks,
          classification_id,
          fund_source_id
        }, {
          ip_address,
          device_info: this.audit.getDeviceInfo(user_agent)
        })
        
        this.logger.log('Pending approved successfully')

        return x

    } catch (error) {
        this.logger.error('Error in approving pending', error)
    }

  }

  @Mutation(() => PendingResponse)
  async disapprove_pending(
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
    @Args('id', { type: () => Int }) id: number,
    @Args('remarks', { type: () => String }) remarks: string,
    @Args('classification_id', { type: () => String, nullable: true }) classification_id?: string | null,
    @Args('fund_source_id', { type: () => String, nullable: true }) fund_source_id?: string | null,
  ) {

    this.logger.log('Disapproving pending...', {
      username: authUser.user.username,
      filename: this.filename,
      pending_id: id,
      remarks,
      classification_id,
      fund_source_id,
    })

    try {
        
        this.pendingService.setAuthUser(authUser)

        const x = await this.pendingService.approveOrDisapprovePending({
          id,
          status: APPROVAL_STATUS.DISAPPROVED,
          remarks,
          classification_id,
          fund_source_id
        }, {
          ip_address,
          device_info: this.audit.getDeviceInfo(user_agent)
        })
        
        this.logger.log('Pending disapproved successfully')

        return x

    } catch (error) {
        this.logger.error('Error in disapproving pending', error)
    }

  }

  @Mutation(() => PendingResponse)
  async update_approver_notes(
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
    @Args('input') input: UpdateApproverNotesInput,
  ): Promise<PendingResponse> {
    const { pending_id, notes } = input;

    this.logger.log('Updating approver notes/comment...', {
      username: authUser.user.username,
      filename: this.filename,
      input: JSON.stringify(input)
    })

    try {

      this.pendingService.setAuthUser(authUser)
      const x = await this.pendingService.update_approver_notes(pending_id, notes, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });

      this.logger.log(x.msg)

      return x

    } catch (error) {
      this.logger.error('Error in updating approver notes', error)
    }

  }
  
}
