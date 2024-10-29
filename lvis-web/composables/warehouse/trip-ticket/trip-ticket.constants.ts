import type { CreateTripTicketApprover } from "./trip-ticket-approver.types";


export const TRIP_TICKET_DEFAULT_APPROVERS: CreateTripTicketApprover[] = [
    {
        approver: null,
        label: 'Dispatched By',
        order: 3,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'GM / OIC',
        order: 4,
        showRequiredMsg: false
    },
]