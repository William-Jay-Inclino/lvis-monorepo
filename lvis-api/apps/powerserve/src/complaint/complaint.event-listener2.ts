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

@Injectable()
export class ComplaintEventListeners {
    private readonly logger = new Logger(ComplaintEventListeners.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
        private eventEmitter: EventEmitter2,
    ) {}

    @OnEvent(ComplaintEvents.CREATED)
    async handle_complaint_created(payload: ComplaintCreatedEvent) {

        console.log('handle_complaint_created');
        
        const { complaint, authUser } = payload
        
        const created_by = authUser.user.username;

        try {
            const recipients = await this.get_recipients({ complaint });
            this.logger.log(`Sending notifications to recipients: ${recipients.join(', ')}`);

            for(let recipient of recipients) {

                const data: CreateNotificationInput = {
                    username: recipient,
                    title: 'New Complaint Created',
                    message: `Complaint ${complaint.ref_number} created by ${created_by}`,
                    notification_type: 'ALERT',
                    metadata: {
                        complaint_id: complaint.id,
                        ref_number: complaint.ref_number,
                        created_by
                    },
                    source_id: complaint.id.toString(),
                    source_type: 'COMPLAINT'
                }

                // insert notification in db
                const notification = await this.notificationService.createNotification(data);

                // send push notification via SSE
                this.eventEmitter.emit(recipient, {
                    event: ComplaintEvents.CREATED,
                    data: notification
                });


            }

        } catch (error) {
            this.logger.error(`Failed to send notifications: ${error.message}`, error.stack);
        }
        
    }

    private async get_recipients(payload: { complaint: Complaint }): Promise<string[]> {
        const { complaint } = payload;
        const api_url = process.env.SYSTEM_API_URL

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

        const oicUserPromise = area.oic_id 
            ? get_user({
                employee_id: area.oic_id, 
                api_url: systemApiUrl
            })
            : Promise.resolve(null);

        const linemenUserPromises = area.linemen.map(lineman => 
            get_user({
                employee_id: lineman.employee_id,
                api_url: systemApiUrl
            })
        );

        const users = await Promise.all([
            oicUserPromise,
            ...linemenUserPromises
        ]);

        return users
            .filter(user => user?.username)
            .map(user => user.username);
    }

}