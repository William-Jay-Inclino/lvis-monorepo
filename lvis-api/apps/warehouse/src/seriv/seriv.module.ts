import { Module } from '@nestjs/common';
import { SerivService } from './seriv.service';
import { SerivResolver } from './seriv.resolver';
import { HttpModule } from '@nestjs/axios';
import { SerivApproverService } from '../seriv-approver/seriv-approver.service';
import { CommonService } from '../__common__/classes';

@Module({
  imports: [HttpModule],
  providers: [SerivResolver, SerivService, SerivApproverService, CommonService],
})
export class SerivModule {}
