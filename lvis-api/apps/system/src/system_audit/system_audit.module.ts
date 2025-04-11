import { Module } from '@nestjs/common';
import { SystemAuditService } from './system_audit.service';
import { SystemAuditResolver } from './system_audit.resolver';

@Module({
    providers: [
        SystemAuditService,
        SystemAuditResolver
    ],
    exports: [SystemAuditService],
})
export class SystemAuditModule {}
