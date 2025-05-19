// notification.controller.ts
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { NotificationService } from './notification.service';
import { SseService } from './sse.service';

@Controller('notifications')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly sseService: SseService
    ) {}

    @Get('sse/:username')
    async subscribeToNotifications(
        @Param('username') username: string,
        @Res() res: Response
    ) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        this.sseService.addClient(username, res);
        res.write('retry: 10000\n\n');

        const ping = setInterval(() => {
            res.write(`event: ping\ndata: {}\n\n`);
        }, 10000);

        // Initial unread notifications
        const notifications = await this.notificationService.getUnreadNotifications(username);
        this.sseService.sendEvent(username, {
            type: 'INIT',
            data: notifications,
        });

        res.on('close', () => {
            clearInterval(ping);
            this.sseService.removeClient(username, res);
        });
    }
}