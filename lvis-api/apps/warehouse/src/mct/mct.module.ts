import { Module } from '@nestjs/common';
import { MctService } from './mct.service';
import { MctResolver } from './mct.resolver';
import { HttpModule } from '@nestjs/axios';
import { MctApproverService } from '../mct-approver/mct-approver.service';
import { MrvService } from '../mrv/mrv.service';
import { CommonService } from '../__common__/classes';

@Module({
  imports: [HttpModule],
  providers: [MctResolver, MctService, MctApproverService, MrvService, CommonService],
})
export class MctModule {}
