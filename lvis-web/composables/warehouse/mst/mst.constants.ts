import type { CreateMSTApprover } from "./mst-approver.types";


export const enum MST_APPROVER{
    RECEIVED_BY = 'received_by',
}

export const MST_DEFAULT_APPROVERS: CreateMSTApprover[] = [
    {
        approver: null,
        label: 'Received By',
        label_id: MST_APPROVER.RECEIVED_BY,
        order: 1,
        showRequiredMsg: false
    },
]