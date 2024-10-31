

export const enum TRIP_TICKET_STATUS {
    PENDING = 1,
    APPROVED = 2,
    DISAPPROVED = 3,
    IN_PROGRESS = 4,
    COMPLETED = 5,
    CANCELLED = 6,
}


export const tripTicketStatus = {
    [TRIP_TICKET_STATUS.PENDING]: {
        value: TRIP_TICKET_STATUS.PENDING,
        label: 'Pending',
        color: 'orange',
    },
    [TRIP_TICKET_STATUS.APPROVED]: {
        value: TRIP_TICKET_STATUS.APPROVED,
        label: 'Approved',
        color: 'success',
    },
    [TRIP_TICKET_STATUS.DISAPPROVED]: {
        value: TRIP_TICKET_STATUS.DISAPPROVED,
        label: 'Disapproved',
        color: 'danger',
    },
    [TRIP_TICKET_STATUS.IN_PROGRESS]: {
        value: TRIP_TICKET_STATUS.IN_PROGRESS,
        label: 'In Progress',
        color: 'info',
    },
    [TRIP_TICKET_STATUS.COMPLETED]: {
        value: TRIP_TICKET_STATUS.COMPLETED,
        label: 'Completed',
        color: 'primary',
    },
    [TRIP_TICKET_STATUS.CANCELLED]: {
        value: TRIP_TICKET_STATUS.CANCELLED,
        label: 'Cancelled',
        color: 'warning',
    },
}