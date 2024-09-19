import { Module } from '@nestjs/common';
import { MctApproverService } from './mct-approver.service';
import { MctApproverResolver } from './mct-approver.resolver';

@Module({
  providers: [MctApproverResolver, MctApproverService],
})
export class MctApproverModule {}
