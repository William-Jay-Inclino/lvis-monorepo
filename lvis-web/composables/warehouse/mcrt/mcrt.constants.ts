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
    {
        approver: null,
        label: 'Noted By',
        order: 3,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Audited By',
        order: 4,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Approved By',
        order: 5,
        showRequiredMsg: false
    },
]