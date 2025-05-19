// src/notification/events/notification.events.ts
export enum NotificationEvents {
  NOTIFICATION_CREATED = 'notification.created',
  NOTIFICATION_READ = 'notification.read',
  NOTIFICATION_SEEN = 'notification.seen',
  NOTIFICATION_DELETED = 'notification.deleted',
  NOTIFICATION_BATCH_UPDATED = 'notification.batch_updated'
}

export class NotificationCreatedEvent {
  constructor(
    public readonly notification: any, // GraphQL Notification type
    public readonly triggerEvent?: string // Optional: what caused the notification
  ) {}
}

export class NotificationReadEvent {
  constructor(
    public readonly notificationId: string,
    public readonly readAt: Date,
    public readonly userId: string
  ) {}
}

export class NotificationSeenEvent {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string
  ) {}
}

export class NotificationDeletedEvent {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly reason?: string
  ) {}
}

export class NotificationBatchUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly updateType: 'read' | 'seen' | 'archived',
    public readonly count: number
  ) {}
}