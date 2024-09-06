import { Module } from '@nestjs/common';
import { OsrivService } from './osriv.service';
import { OsrivResolver } from './osriv.resolver';
import { HttpModule } from '@nestjs/axios';
import { OsrivApproverService } from '../osriv-approver/osriv-approver.service';

@Module({
  imports: [HttpModule],
  providers: [OsrivResolver, OsrivService, OsrivApproverService],
})
export class OsrivModule {}
