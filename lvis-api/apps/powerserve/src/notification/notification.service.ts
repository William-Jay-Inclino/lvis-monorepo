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

        if(notification.metadata) {
            notification.metadata = JSON.stringify(notification.metadata)
        }

        return notification as Notification

    }

    // async markAsRead(notificationId: string): Promise<Notification> {
    //     const notification = await this.prisma.notification.update({
    //         where: { id: notificationId },
    //         data: { 
    //             is_read: true,
    //             read_at: new Date()
    //         }
    //     });

    //     if(notification.metadata) {
    //         notification.metadata = JSON.stringify(notification.metadata)
    //     }

    //     return notification as Notification

    // }

    async markMultipleAsRead(notificationIds: string[]): Promise<number> {
        const { count } = await this.prisma.notification.updateMany({
            where: { 
                id: { in: notificationIds },
                is_read: false // Only update unread notifications
            },
            data: {
                is_read: true,
                read_at: new Date()
            }
        });
        return count;
    }

    async markAsSeen(notificationId: string): Promise<Notification> {
        const notification = await this.prisma.notification.update({
            where: { id: notificationId },
            data: { is_seen: true }
        });

        if(notification.metadata) {
            notification.metadata = JSON.stringify(notification.metadata)
        }

        if(notification.metadata) {
            notification.metadata = JSON.stringify(notification.metadata)
        }

        return notification as Notification
    }

    async getNotifications(payload: { username: string }): Promise<Notification[]> {
        
        const { username } = payload

        const notifications = await this.prisma.notification.findMany({
            where: { 
                username,
            },
            orderBy: { created_at: 'desc' },
            take: 30,
        });

        return notifications.map(i => {
			i.metadata= !!i.metadata ? JSON.stringify(i.metadata) : null
			return i
		}) as Notification[]

    }

    async getUnreadNotifications(username: string): Promise<Notification[]> {
        const notifications = await this.prisma.notification.findMany({
            where: { 
                username,
                is_read: false 
            },
            orderBy: { created_at: 'desc' }
        });

        return notifications.map(i => {
			i.metadata= !!i.metadata ? JSON.stringify(i.metadata) : null
			return i
		}) as Notification[]

    }

}