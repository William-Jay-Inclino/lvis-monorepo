import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationCreatedEvent, NotificationEvents } from "../events/notification.events";
import { Complaint } from "../../complaint/entities/complaint.entity";
import { ASSIGNED_GROUP_TYPE } from "../../complaint/entities/constants";
import { PrismaService } from "../../__prisma__/prisma.service";
import { AuthUser } from "apps/system/src/__common__/auth-user.entity";
import axios from "axios";

@Injectable()
export class NotificationHelper {
    private readonly logger = new Logger(NotificationHelper.name);

    constructor(
        private eventEmitter: EventEmitter2,
        private readonly prisma: PrismaService,
    ) {}

    async notifyNewComplaint(payload: { complaint: Complaint, authUser: AuthUser }) {
        const { complaint, authUser } = payload;
        const created_by = authUser.user.username;

        try {
            const recipients = await this.get_recipients({ complaint });
            this.logger.log(`Sending notifications to recipients: ${recipients.join(', ')}`);

            recipients.forEach(username => {
                this.eventEmitter.emit(
                    NotificationEvents.NOTIFICATION_CREATED,
                    new NotificationCreatedEvent({
                        username,
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
                    })
                );
            });
        } catch (error) {
            this.logger.error(`Failed to send notifications: ${error.message}`, error.stack);
        }
    }

    private async get_recipients(payload: { complaint: Complaint }): Promise<string[]> {
        const { complaint } = payload;

        try {
            switch (complaint.assigned_group_type) {
                case ASSIGNED_GROUP_TYPE.AREA:
                    return await this.getAreaRecipients(complaint.assigned_group_id);
                case ASSIGNED_GROUP_TYPE.DIVISION:
                    return await this.get_users_by({ division_id: complaint.assigned_group_id });
                case ASSIGNED_GROUP_TYPE.DEPARTMENT:
                    return await this.get_users_by({ department_id: complaint.assigned_group_id });
                default:
                    return [];
            }
        } catch (error) {
            this.logger.error(`Failed to get recipients: ${error.message}`, error.stack);
            return [];
        }
    }

    private async getAreaRecipients(areaId: string): Promise<string[]> {
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

        const userPromises = [
            ...(area.oic_id ? [this.get_user(area.oic_id)] : []),
            ...area.linemen.map(lineman => this.get_user(lineman.employee_id))
        ];

        const users = await Promise.all(userPromises);
        return users.filter(user => user?.username).map(user => user.username);
    }

    async get_user(employee_id: string): Promise<{ username: string } | null> {
        try {
            const { data } = await axios.get(
                `${process.env.SYSTEM_API_URL}/user/get-user-by-employee-id/${encodeURIComponent(employee_id)}`,
                { timeout: 3000 }
            );
            return data?.username ? data : null;
        } catch (error) {
            if (error.response?.status !== 404) {
                this.logger.warn(`Failed to fetch user ${employee_id}: ${error.message}`);
            }
            return null;
        }
    }

    async get_users_by(payload: { division_id?: string; department_id?: string }): Promise<string[]> {
        const { division_id, department_id } = payload;
        if (!division_id && !department_id) return [];

        try {
            const endpoint = division_id 
                ? `get-usernames-by-division-id/${encodeURIComponent(division_id)}`
                : `get-usernames-by-department-id/${encodeURIComponent(department_id!)}`;

            const { data } = await axios.get<string[]>(
                `${process.env.SYSTEM_API_URL}/user/${endpoint}`,
                { timeout: 3000 }
            );

            return Array.isArray(data) 
                ? data.filter(username => typeof username === 'string' && username)
                : [];
        } catch (error) {
            if (error.response?.status !== 404) {
                this.logger.warn(`Failed to fetch users: ${error.message}`);
            }
            return [];
        }
    }
}