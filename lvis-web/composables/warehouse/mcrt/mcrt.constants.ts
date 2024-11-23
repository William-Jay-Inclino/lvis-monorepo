import type { CreateMCRTApprover } from "./mcrt-approver.types";


export const MCRT_DEFAULT_APPROVERS: CreateMCRTApprover[] = [
    {
        approver: null,
        label: 'Prepared By',
        order: 1,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Received By',
        order: 2,
        showRequiredMsg: false
    },
]