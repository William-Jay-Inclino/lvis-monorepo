import { Module } from '@nestjs/common';
import { OsrivApproverService } from './osriv-approver.service';
import { OsrivApproverResolver } from './osriv-approver.resolver';

@Module({
  providers: [
    OsrivApproverResolver, 
    OsrivApproverService],
})
export class OsrivApproverModule {}
