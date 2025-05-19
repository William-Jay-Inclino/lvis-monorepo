import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEvents } from '../events/notification.events';
import {
  NotificationCreatedEvent,
  NotificationReadEvent,
  NotificationSeenEvent,
  NotificationDeletedEvent,
  NotificationBatchUpdatedEvent
} from '../events/notification.events';
import { NotificationService } from '../notification.service';

@Injectable()
export class NotificationListeners {
	private readonly logger = new Logger(NotificationListeners.name);

	constructor(
		private readonly notificationService: NotificationService,
	) {}

	@OnEvent(NotificationEvents.NOTIFICATION_CREATED)
	async handleNotificationCreated(payload: NotificationCreatedEvent) {
		
		const { notification } = payload
		
		// create items in the notification table in db
		const response = await this.notificationService.createNotification(notification)


		// send push notifications to client
		
	}

	@OnEvent(NotificationEvents.NOTIFICATION_READ)
	handleNotificationRead(payload: NotificationReadEvent) {
		this.logger.log(
		`Notification ${payload.notificationId} marked as read by user ${payload.userId}`
		);
		
		// Example actions:
		// - Update read status in analytics
		// - Decrement unread counter
		// - Log user engagement
	}

	@OnEvent(NotificationEvents.NOTIFICATION_SEEN)
	handleNotificationSeen(payload: NotificationSeenEvent) {
		this.logger.debug(
		`Notification ${payload.notificationId} marked as seen by user ${payload.userId}`
		);
		
		// Example actions:
		// - Update UI state in real-time
		// - Trigger seen analytics
	}

	@OnEvent(NotificationEvents.NOTIFICATION_DELETED)
	handleNotificationDeleted(payload: NotificationDeletedEvent) {
		this.logger.warn(
		`Notification ${payload.notificationId} deleted by user ${payload.userId}` +
		(payload.reason ? ` | Reason: ${payload.reason}` : '')
		);
		
		// Example actions:
		// - Archive to cold storage
		// - Update deletion metrics
	}

	@OnEvent(NotificationEvents.NOTIFICATION_BATCH_UPDATED)
	handleBatchUpdate(payload: NotificationBatchUpdatedEvent) {
		this.logger.log(
		`Batch update: ${payload.count} notifications ${payload.updateType} for user ${payload.userId}`
		);
		
		// Example actions:
		// - Update bulk status in analytics
		// - Clear cache entries
		// - Send batch confirmation
	}
}