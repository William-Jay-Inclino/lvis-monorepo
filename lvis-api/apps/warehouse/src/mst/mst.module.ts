import { Module } from '@nestjs/common';
import { MstService } from './mst.service';
import { MstResolver } from './mst.resolver';
import { HttpModule } from '@nestjs/axios';
import { MstApproverService } from '../mst-approver/mst-approver.service';

@Module({
  imports: [HttpModule],
  providers: [MstResolver, MstService, MstApproverService],
})
export class MstModule {}
