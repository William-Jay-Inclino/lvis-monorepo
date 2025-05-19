import { AuthUser } from "apps/system/src/__common__/auth-user.entity";
import { Complaint } from "../entities/complaint.entity";

export enum ComplaintEvents {
    COMPLAINT_CREATED = 'complaint.created',
}


export class ComplaintCreatedEvent {
    constructor(
        public readonly complaint: Complaint,
        public readonly authUser: AuthUser,
    ) {}
}