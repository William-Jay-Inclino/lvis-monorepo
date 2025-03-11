import { Module } from '@nestjs/common';
import { LinemanService } from './lineman.service';
import { LinemanResolver } from './lineman.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [LinemanResolver, LinemanService],
})
export class LinemanModule {}
