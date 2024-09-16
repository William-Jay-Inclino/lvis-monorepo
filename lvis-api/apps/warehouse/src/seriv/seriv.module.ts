import { Module } from '@nestjs/common';
import { SerivService } from './seriv.service';
import { SerivResolver } from './seriv.resolver';
import { HttpModule } from '@nestjs/axios';
import { SerivApproverService } from '../seriv-approver/seriv-approver.service';

@Module({
  imports: [HttpModule],
  providers: [SerivResolver, SerivService, SerivApproverService],
})
export class SerivModule {}
