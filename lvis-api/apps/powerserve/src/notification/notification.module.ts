import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { NotificationListeners } from './listeners/notification.listeners';
import { NotificationsController } from './notification.controller';

@Module({
    controllers: [ NotificationsController ],
    providers: [NotificationResolver, NotificationService, NotificationListeners],
    exports: [NotificationModule]
})
export class NotificationModule {}
