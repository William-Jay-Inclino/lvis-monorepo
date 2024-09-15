import { Module } from '@nestjs/common';
import { SerivApproverService } from './seriv-approver.service';
import { SerivApproverResolver } from './seriv-approver.resolver';

@Module({
  providers: [SerivApproverResolver, SerivApproverService],
})
export class SerivApproverModule {}
