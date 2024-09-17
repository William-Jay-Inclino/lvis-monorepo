import { Module } from '@nestjs/common';
import { MrvApproverService } from './mrv-approver.service';
import { MrvApproverResolver } from './mrv-approver.resolver';

@Module({
  providers: [MrvApproverResolver, MrvApproverService],
})
export class MrvApproverModule {}
