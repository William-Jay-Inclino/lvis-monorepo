import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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

        console.log('createNotification', input);

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

        return this.mapToGraphQL(notification);
    }

    async markAsSeen(notificationId: string): Promise<Notification> {
        const notification = await this.prisma.notification.update({
            where: { id: notificationId },
            data: { is_seen: true }
        });

        return this.mapToGraphQL(notification);
    }

    async getUserNotifications(username: string): Promise<Notification[]> {
        const notifications = await this.prisma.notification.findMany({
            where: { username },
            orderBy: { created_at: 'desc' }
        });

        return notifications.map(this.mapToGraphQL);
    }

    async getUnreadNotifications(username: string): Promise<Notification[]> {
        const notifications = await this.prisma.notification.findMany({
            where: { 
                username,
                is_read: false 
            },
            orderBy: { created_at: 'desc' }
        });

        return notifications.map(this.mapToGraphQL);
    }

    private mapToGraphQL(notification: any): Notification {
        return {
            id: notification.id,
            username: notification.username,
            title: notification.title,
            message: notification.message,
            notification_type: notification.notification_type,
            is_read: notification.is_read,
            is_seen: notification.is_seen,
            created_at: notification.created_at,
            read_at: notification.read_at,
            metadata: notification.metadata,
            source_id: notification.source_id,
            source_type: notification.source_type
        };
    }
}