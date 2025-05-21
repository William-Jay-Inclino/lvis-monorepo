import { AuthUser } from "apps/system/src/__common__/auth-user.entity";
import { Task } from "../entities/task.entity";

export enum TaskEvents {
    CREATE = 'task.create',
    ASSIGNED = 'task.assigned',
    ONGOING = 'task.ongoing',
    COMPLETED = 'task.completed',
    UNRESOLVED = 'task.resolved',
    CANCELLED = 'task.cancelled',
}


export class TaskAssignedEvent {
    constructor(
        public readonly task: Task,
        public readonly authUser: AuthUser,
    ) {}
}

export class TaskOngoingEvent {
    constructor(
        public readonly task: Task,
        public readonly authUser: AuthUser,
    ) {}
}

export class TaskCompletedEvent {
    constructor(
        public readonly task: Task,
        public readonly authUser: AuthUser,
    ) {}
}

export class TaskUnresolvedEvent {
    constructor(
        public readonly task: Task,
        public readonly authUser: AuthUser,
    ) {}
}

export class TaskCancelledEvent {
    constructor(
        public readonly task: Task,
        public readonly authUser: AuthUser,
    ) {}
}