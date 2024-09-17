import { Module } from '@nestjs/common';
import { MrvService } from './mrv.service';
import { MrvResolver } from './mrv.resolver';
import { HttpModule } from '@nestjs/axios';
import { MrvApproverService } from '../mrv-approver/mrv-approver.service';

@Module({
  imports: [HttpModule],
  providers: [MrvResolver, MrvService, MrvApproverService],
})
export class MrvModule {}
