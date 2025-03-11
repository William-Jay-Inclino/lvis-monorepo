import { Module } from '@nestjs/common';
import { ComplaintLogService } from './complaint_log.service';
import { ComplaintLogResolver } from './complaint_log.resolver';

@Module({
  providers: [ComplaintLogResolver, ComplaintLogService],
})
export class ComplaintLogModule {}
