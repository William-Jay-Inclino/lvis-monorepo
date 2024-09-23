import { Module } from '@nestjs/common';
import { MctService } from './mct.service';
import { MctResolver } from './mct.resolver';
import { HttpModule } from '@nestjs/axios';
import { MctApproverService } from '../mct-approver/mct-approver.service';

@Module({
  imports: [HttpModule],
  providers: [MctResolver, MctService, MctApproverService],
})
export class MctModule {}
