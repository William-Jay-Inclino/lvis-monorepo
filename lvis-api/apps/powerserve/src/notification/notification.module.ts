import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SseService } from './sse.service';

@Module({
    controllers: [ NotificationController ],
    providers: [NotificationService, SseService],
    exports: [NotificationService, SseService]
})
export class NotificationModule {}
