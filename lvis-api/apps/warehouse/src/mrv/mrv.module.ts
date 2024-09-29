import { Module } from '@nestjs/common';
import { MrvService } from './mrv.service';
import { MrvResolver } from './mrv.resolver';
import { HttpModule } from '@nestjs/axios';
import { MrvApproverService } from '../mrv-approver/mrv-approver.service';
import { CommonService } from '../__common__/classes';

@Module({
  imports: [HttpModule],
  providers: [MrvResolver, MrvService, MrvApproverService, CommonService],
})
export class MrvModule {}
