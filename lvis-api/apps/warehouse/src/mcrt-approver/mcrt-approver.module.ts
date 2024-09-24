import { Module } from '@nestjs/common';
import { McrtApproverService } from './mcrt-approver.service';
import { McrtApproverResolver } from './mcrt-approver.resolver';

@Module({
  providers: [McrtApproverResolver, McrtApproverService],
})
export class McrtApproverModule {}
