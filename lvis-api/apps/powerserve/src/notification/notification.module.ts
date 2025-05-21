import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationResolver } from './notification.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
    imports: [PowerserveAuditModule],
    controllers: [ NotificationController ],
    providers: [NotificationResolver, NotificationService],
    exports: [NotificationService]
})
export class NotificationModule {}
