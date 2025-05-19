import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateNotificationInput } from './dto/create-notification.input';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async createNotification(input: CreateNotificationInput): Promise<Notification> {

        const notification = await this.prisma.notification.create({
            data: {
                username: input.username,
                title: input.title,
                message: input.message,
                notification_type: input.notification_type,
                metadata: input.metadata,
                source_id: input.source_id,
                source_type: input.source_type
            }
        });

        return notification

    }

    async markAsRead(notificationId: string): Promise<Notification> {
        const notification = await this.prisma.notification.update({
            where: { id: notificationId },
            data: { 
                is_read: true,
                read_at: new Date()
            }
        });

        return notification

    }

    async markAsSeen(notificationId: string): Promise<Notification> {
        const notification = await this.prisma.notification.update({
            where: { id: notificationId },
            data: { is_seen: true }
        });

        return notification
    }

    async getUnreadNotifications(username: string): Promise<Notification[]> {
        const notifications = await this.prisma.notification.findMany({
            where: { 
                username,
                is_read: false 
            },
            orderBy: { created_at: 'desc' }
        });

        return notifications

    }

}