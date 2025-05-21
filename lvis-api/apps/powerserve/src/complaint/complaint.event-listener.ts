import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  ComplaintCreatedEvent,
  ComplaintEvents,
} from './events/complaint.events';
import { PrismaService } from '../__prisma__/prisma.service';
import { get_user, get_usernames } from 'libs/user';
import { Complaint } from './entities/complaint.entity';
import { ASSIGNED_GROUP_TYPE } from './entities/constants';
import { CreateNotificationInput } from '../notification/dto/create-notification.input';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class ComplaintEventListeners {
    private readonly logger = new Logger(ComplaintEventListeners.name);
    private readonly BATCH_SIZE = 10; // Adjust based on your system capacity

    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
        private eventEmitter: EventEmitter2,
    ) {}

    @OnEvent(ComplaintEvents.CREATED)
    async handle_complaint_created(payload: ComplaintCreatedEvent) {
        this.logger.log('handle_complaint_created');
        
        const { complaint, authUser } = payload;
        const created_by = authUser.user.username;

        try {
            const recipients = await this.get_recipients({ complaint });
            this.logger.log(`Sending notifications to ${recipients.length} recipients`);

            // Process notifications in parallel batches
            await this.processNotificationsInBatches(recipients, complaint, created_by);

        } catch (error) {
            this.logger.error(`Failed to send notifications: ${error.message}`, error.stack);
        }
    }

    private async processNotificationsInBatches(
        recipients: string[],
        complaint: Complaint,
        created_by: string
    ): Promise<void> {

        const notificationsData = recipients.map(recipient => ({
            username: recipient,
            title: '🚨 New Complaint Received',
            message: `Complaint Ref #${complaint.ref_number} (${complaint.description.substring(0, 80)}${complaint.description.length > 80 ? '...' : ''}) logged by ${created_by} - Task Ref #${complaint.tasks[0].ref_number}`,
            notification_type: NotificationType.ALERT,
            metadata: {
                complaint_id: complaint.id,
                complaint_ref_number: complaint.ref_number,
                task_ref_number: complaint.tasks[0].ref_number,
            },
            source_id: complaint.id.toString(),
            source_type: 'COMPLAINT'
        }));

        // Process in batches
        for (let i = 0; i < notificationsData.length; i += this.BATCH_SIZE) {
            const batch = notificationsData.slice(i, i + this.BATCH_SIZE);
            
            try {
                // Process batch in parallel
                const results = await Promise.allSettled(
                    batch.map(data => this.processSingleNotification(data))
                );

                // Log any failures
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        this.logger.error(
                            `Failed to send notification to ${batch[index].username}: ${result.reason.message}`,
                            result.reason.stack
                        );
                    }
                });

            } catch (batchError) {
                this.logger.error(`Batch processing failed: ${batchError.message}`, batchError.stack);
            }
        }
    }

    private async processSingleNotification(data: CreateNotificationInput) {
        // Insert notification in db
        const notification = await this.notificationService.createNotification(data);

        // Send push notification via SSE
        this.eventEmitter.emit(data.username, {
            event: ComplaintEvents.CREATED,
            data: notification
        });
    }

    private async get_recipients(payload: { complaint: Complaint }): Promise<string[]> {
        const { complaint } = payload;
        const api_url = process.env.SYSTEM_API_URL;

        try {
            switch (complaint.assigned_group_type) {
                case ASSIGNED_GROUP_TYPE.AREA:
                    return await this.get_area_recipients(complaint.assigned_group_id);
                case ASSIGNED_GROUP_TYPE.DIVISION:
                    return await get_usernames({ division_id: complaint.assigned_group_id, api_url });
                case ASSIGNED_GROUP_TYPE.DEPARTMENT:
                    return await get_usernames({ department_id: complaint.assigned_group_id, api_url });
                default:
                    return [];
            }
        } catch (error) {
            this.logger.error(`Failed to get recipients: ${error.message}`, error.stack);
            return [];
        }
    }

    private async get_area_recipients(areaId: string): Promise<string[]> {
        // Fetch area with OIC and linemen information
        const area = await this.prisma.area.findUnique({
            where: { id: areaId },
            select: {
                oic_id: true,
                linemen: { select: { employee_id: true } },
            }
        });

        if (!area) {
            this.logger.warn(`Area not found with ID: ${areaId}`);
            return [];
        }

        const systemApiUrl = process.env.SYSTEM_API_URL;
        const userPromises: Promise<any>[] = [];

        if (area.oic_id) {
            userPromises.push(get_user({
                employee_id: area.oic_id, 
                api_url: systemApiUrl
            }));
        }

        area.linemen.forEach(lineman => {
            userPromises.push(get_user({
                employee_id: lineman.employee_id,
                api_url: systemApiUrl
            }));
        });

        const users = await Promise.allSettled(userPromises);

        return users
            .filter(result => result.status === 'fulfilled' && result.value?.username)
            .map(result => (result as PromiseFulfilledResult<any>).value.username);
    }
}