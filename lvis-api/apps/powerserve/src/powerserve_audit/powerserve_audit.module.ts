import { Module } from '@nestjs/common';
import { PowerserveAuditService } from './powerserve_audit.service';

@Module({
  providers: [PowerserveAuditService],
  exports: [PowerserveAuditService]
})
export class PowerserveAuditModule {}
