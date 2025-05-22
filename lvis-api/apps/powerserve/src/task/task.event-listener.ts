import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateNotificationInput } from '../notification/dto/create-notification.input';
import { NotificationService } from '../notification/notification.service';
import { Task } from './entities/task.entity';
import { TaskAssignedEvent, TaskEvents } from './events/task.events';
import { get_user, get_usernames } from 'libs/user';
import { NotificationType } from 'apps/powerserve/prisma/generated/client';
import { TASK_STATUS } from './entities/constants';

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

    @OnEvent(TaskEvents.CREATED)
    async handle_task_created(payload: TaskAssignedEvent) {
        this.logger.log('handle_task_created');
        
        const { task, authUser } = payload;
        const created_by = authUser.user.username;

        try {
            let recipients = await this.get_recipients({ task });
            recipients = recipients.filter(username => username !== created_by);
            this.logger.log(`Sending notifications to ${recipients.length} recipients`);

            // Default message for unassigned task
            let assignmentMessage = `created by <b>${created_by}</b>`;
            let assigneeUsername = '';

            // Only process assignment if task has an assignee
            if (task.assignee_id) {
                const assignee = await get_user({ 
                    employee_id: task.assignee_id, 
                    api_url: this.systemApiUrl 
                });
                assigneeUsername = assignee?.username || '';
                
                if (assigneeUsername) {
                    assignmentMessage = `assigned by <b>${created_by}</b> to <b>${assigneeUsername}</b>`;
                }
            }

            const truncatedDescription = task.description.length > 80
                ? `${task.description.substring(0, 80)}...`
                : task.description;

            const complaintRef = task.complaint?.ref_number 
                ? ` - <span class="text-primary">Complaint #${task.complaint.ref_number}</span>`
                : '';

            await this.process_notifications_in_batches({
                recipients,
                task,
                title: `New Task Created 📝`,
                message: `<span class="text-primary">Task #${task.ref_number}</span> ${truncatedDescription} — ${assignmentMessage}${complaintRef}`,
                event: TaskEvents.CREATED
            });

        } catch (error) {
            this.logger.error(`Failed to send notifications: ${error.message}`, error.stack);
        }
    }

    @OnEvent(TaskEvents.ASSIGNED)
    async handle_task_assigned(payload: TaskAssignedEvent) {
        this.logger.log('handle_task_assigned');
        
        const { task, authUser } = payload;
        const created_by = authUser.user.username;

        try {
            let recipients = await this.get_recipients({ task });
            recipients = recipients.filter(username => username !== created_by);

            this.logger.log(`Sending notifications to ${recipients.length} recipients`);

            const assignee = await get_user({ 
                employee_id: task.assignee_id, 
                api_url: this.systemApiUrl 
            });

            const isSelfAssignment = created_by === assignee.username;
            let assignmentMessage = isSelfAssignment 
                ? `<b>${created_by}</b> grabs the task`  
                : `assigned by <b>${created_by}</b> to <b>${assignee.username}></b>`;

            if(task.task_status_id === TASK_STATUS.ONGOING) {
                assignmentMessage += ' and starts working on it'
            }

            const truncatedDescription = task.description.length > 80
                ? `${task.description.substring(0, 80)}...`
                : task.description;

        const complaintRef = task.complaint?.ref_number 
            ? ` - <span class="text-primary">Complaint #${task.complaint.ref_number}</span>`
            : '';

        await this.process_notifications_in_batches({
            recipients,
            task,
            title: `Task Assigned 📌`,
            message: `<span class="text-primary">Task #${task.ref_number}</span> ${truncatedDescription} — ${assignmentMessage}${complaintRef}`,
            event: TaskEvents.ASSIGNED
        });

        } catch (error) {
            this.logger.error(`Failed to send notifications: ${error.message}`, error.stack);
        }
    }

    @OnEvent(TaskEvents.UPDATED)
    async handle_task_updated(payload: TaskAssignedEvent) {
        this.logger.log('handle_task_updated');
        
        const { task, authUser } = payload;
        const created_by = authUser.user.username;

        try {
            let recipients = await this.get_recipients({ task });
            recipients = recipients.filter(username => username !== created_by);

            this.logger.log(`Sending notifications to ${recipients.length} recipients`);

            const assignee = await get_user({ 
                employee_id: task.assignee_id, 
                api_url: this.systemApiUrl 
            });

            let action_message = `<b>${ assignee.username }</b> updates the task`

            const truncatedDescription = task.description.length > 80
                ? `${task.description.substring(0, 80)}...`
                : task.description;

            if(task.task_status_id === TASK_STATUS.ONGOING) {
                action_message += ` <div class="badge soft-badge soft-badge-blue">ONGOING</div>`
            } else if(task.task_status_id === TASK_STATUS.COMPLETED) {
                action_message += ` <div class="badge soft-badge soft-badge-green">COMPLETED</div>`
            } else if(task.task_status_id === TASK_STATUS.UNRESOLVED) {
                action_message += ` <div class="badge soft-badge soft-badge-orange">UNRESOLVED</div>`
            } else if(task.task_status_id === TASK_STATUS.CANCELLED) {
                action_message += ` <div class="badge soft-badge soft-badge-red">CANCELLED</div>`
            }


        await this.process_notifications_in_batches({
            recipients,
            task,
            title: 'Task Updated ✅',
            message: `<span class="text-primary">Task #${task.ref_number}</span> ${truncatedDescription} — ${action_message}`,
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

    /*
        Recipients:

        if area:
            OIC
            All lineman belongs to the area

        if division / department:
            All employees belong
            
        if task has assignee:
            Assignee
            Assignee's supervisor

    */
    private async get_recipients(payload: { task: Task }): Promise<string[]> {
        const { task } = payload;
        const api_url = process.env.SYSTEM_API_URL;

        try {
            let recipients: string[];

            if (task.task_assignment.area_id) {
                recipients = await this.get_area_recipients(task.task_assignment.area_id);
            } else if (task.task_assignment.division_id) {
                recipients = await get_usernames({ division_id: task.task_assignment.division_id, api_url });
            } else {
                recipients = await get_usernames({ department_id: task.task_assignment.department_id, api_url });
            }

            if (task.assignee_id) {
                const assigneeId = task.assignee_id;

                // Fire off two promises in parallel
                const [assignee_user, lineman] = await Promise.all([
                    get_user({ employee_id: assigneeId, api_url }),
                    this.prisma.lineman.findUnique({
                        where: { employee_id: assigneeId },
                        select: { supervisor_id: true }
                    }),
                ]);

                if (assignee_user?.username) {
                    recipients.push(assignee_user.username);
                }

                if (lineman?.supervisor_id) {
                    const supervisor_user = await get_user({ employee_id: lineman.supervisor_id, api_url });
                    if (supervisor_user?.username) {
                        recipients.push(supervisor_user.username);
                    }
                }
            }

            // Remove duplicates and return
            return [...new Set(recipients)];
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

        const userPromises: Promise<any>[] = [];

        if (area.oic_id) {
            userPromises.push(get_user({
                employee_id: area.oic_id, 
                api_url: this.systemApiUrl
            }));
        }

        area.linemen.forEach(lineman => {
            userPromises.push(get_user({
                employee_id: lineman.employee_id,
                api_url: this.systemApiUrl
            }));
        });

        const users = await Promise.allSettled(userPromises);

        return users
            .filter(result => result.status === 'fulfilled' && result.value?.username)
            .map(result => (result as PromiseFulfilledResult<any>).value.username);
    }

}