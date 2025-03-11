import { Module } from '@nestjs/common';
import { ComplaintDetailService } from './complaint_detail.service';
import { ComplaintDetailResolver } from './complaint_detail.resolver';

@Module({
  providers: [ComplaintDetailResolver, ComplaintDetailService],
})
export class ComplaintDetailModule {}
