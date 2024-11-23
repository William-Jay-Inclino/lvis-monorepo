import type { CreateMRVApprover } from "./mrv-approver.types";

export const MRV_DEFAULT_APPROVERS: CreateMRVApprover[] = [
    {
        approver: null,
        label: 'Checked By',
        order: 1,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Approved By',
        order: 2,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Audited By',
        order: 3,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Confirmed By',
        order: 4,
        showRequiredMsg: false
    },
]