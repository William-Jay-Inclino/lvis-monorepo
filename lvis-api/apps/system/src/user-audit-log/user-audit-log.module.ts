import { Module } from '@nestjs/common';
import { UserAuditLogService } from './user-audit-log.service';
import { UserAuditLogController } from './user-audit-log.controller';

@Module({
  controllers: [UserAuditLogController],
  providers: [UserAuditLogService],
})
export class UserAuditLogModule {}
