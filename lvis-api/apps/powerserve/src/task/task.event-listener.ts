import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateNotificationInput } from '../notification/dto/create-notification.input';
import { NotificationService } from '../notification/notification.service';
import { Task } from './entities/task.entity';
import { TaskAssignedEvent, TaskEvents } from './events/task.events';
import { get_user } from 'libs/user';
import { NotificationType } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class TaskEventListeners {
    private readonly logger = new Logger(TaskEventListeners.name);
    private readonly BATCH_SIZE = 10; 
    private readonly systemApiUrl = process.env.SYSTEM_API_URL;

    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
        private eventEmitter: EventEmitter2,
    ) {}

    @OnEvent(TaskEvents.ASSIGNED)
    async handle_task_assigned(payload: TaskAssignedEvent) {
        this.logger.log('handle_task_assigned');
        
        const { task, authUser } = payload;
        const created_by = authUser.user.username;

        try {
            const recipients = await this.get_recipients({ task });
            this.logger.log(`Sending notifications to ${recipients.length} recipients`);

            const assignee = await get_user({ 
                employee_id: task.assignee_id, 
                api_url: this.systemApiUrl 
            });

            const isSelfAssignment = created_by === assignee.username;
            const assignmentMessage = isSelfAssignment 
                ? `${created_by} grabs the task`  
                : `assigned by ${created_by} to ${assignee.username}`;

            const truncatedDescription = task.description.length > 80
                ? `${task.description.substring(0, 80)}...`
                : task.description;

        const complaintRef = task.complaint?.ref_number 
            ? ` - Complaint #${task.complaint.ref_number}`
            : '';

        await this.process_notifications_in_batches({
            recipients,
            task,
            title: `Task Assigned`,
            message: `Task #${task.ref_number} (${truncatedDescription}) ${assignmentMessage}${complaintRef}`,
            event: TaskEvents.ASSIGNED
        });

        } catch (error) {
            this.logger.error(`Failed to send notifications: ${error.message}`, error.stack);
        }
    }

    private async process_notifications_in_batches(
        payload: {
            recipients: string[],
            task: Task,
            title: string,
            message: string,
            event: TaskEvents
        }
    ): Promise<void> {

        const { recipients, task, title, message, event } = payload

        const notificationsData = recipients.map(recipient => ({
            username: recipient,
            title,
            message,
            notification_type: NotificationType.ALERT,
            metadata: {
                task_id: task.id,
                task_ref_number: task.ref_number,
            },
            source_id: task.id.toString(),
            source_type: 'TASK'
        }));

        // Process in batches
        for (let i = 0; i < notificationsData.length; i += this.BATCH_SIZE) {
            const batch = notificationsData.slice(i, i + this.BATCH_SIZE);
            
            try {
                // Process batch in parallel
                const results = await Promise.allSettled(
                    batch.map(data => this.process_single_notification({ data, event }))
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

    private async process_single_notification(payload: { data: CreateNotificationInput, event: TaskEvents }) {

        const { data, event } = payload

        // Insert notification in db
        const notification = await this.notificationService.createNotification(data);

        // Send push notification via SSE
        this.eventEmitter.emit(data.username, {
            event,
            data: notification
        });
    }

    // recipients: supervisor, area OIC, complaint creator
    private async get_recipients(payload: { task: Task }): Promise<string[]> {
        const { task } = payload;
        
        
        // Initialize recipients with the task creator
        const recipients = new Set<string>([task.complaint.created_by]);

        try {
            const lineman = await this.prisma.lineman.findUnique({
                where: { employee_id: task.assignee_id },
                select: {
                    area: {
                        select: {
                            oic_id: true
                        }
                    },
                    supervisor_id: true,
                }
            });

            if (!lineman) {
                return Array.from(recipients);
            }

            // Prepare user fetch operations
            const usersToFetch = [
                lineman.supervisor_id,
                lineman.area.oic_id
            ].filter(Boolean); // Remove any undefined/null values

            // Fetch all users in parallel
            const userPromises = usersToFetch.map(employee_id => 
                get_user({ employee_id, api_url: this.systemApiUrl })
            );

            const userResults = await Promise.allSettled(userPromises);

            // Process successful results
            for (const result of userResults) {
                if (result.status === 'fulfilled' && result.value?.username) {
                    recipients.add(result.value.username);
                }
            }

            return Array.from(recipients);
        } catch (error) {
            this.logger.error(`Failed to get recipients: ${error.message}`, error.stack);
            return Array.from(recipients); // Return what we have even if there was an error
        }
    }

}