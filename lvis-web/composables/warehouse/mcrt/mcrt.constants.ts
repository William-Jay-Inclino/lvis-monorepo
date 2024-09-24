import type { CreateMCRTApprover } from "./mcrt-approver.types";


export const enum MCRT_APPROVER{
    PREPARED_BY = 'prepared_by',
    RECEIVED_BY = 'received_by',
}

export const MCRT_DEFAULT_APPROVERS: CreateMCRTApprover[] = [
    {
        approver: null,
        label: 'Prepared By',
        label_id: MCRT_APPROVER.PREPARED_BY,
        order: 1,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Received By',
        label_id: MCRT_APPROVER.RECEIVED_BY,
        order: 2,
        showRequiredMsg: false
    },
]