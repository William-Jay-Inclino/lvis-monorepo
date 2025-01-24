import { Module } from '@nestjs/common';
import { SystemAuditService } from './system_audit.service';

@Module({
    providers: [
        SystemAuditService,
    ],
    exports: [SystemAuditService],
})
export class SystemAuditModule {}
