import { Module } from '@nestjs/common';
import { MstApproverService } from './mst-approver.service';
import { MstApproverResolver } from './mst-approver.resolver';

@Module({
  providers: [MstApproverResolver, MstApproverService],
})
export class MstApproverModule {}
