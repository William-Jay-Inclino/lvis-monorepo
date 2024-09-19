import type { CreateMRVApprover } from "./mrv-approver.types";


export const enum MRV_APPROVER{
    CHECKED_BY = 'checked_by',
    APPROVED_BY = 'approved_by',
    AUDITED_BY = 'audited_by',
    CONFIRMED_BY = 'confirmed_by',
}

export const MRV_DEFAULT_APPROVERS: CreateMRVApprover[] = [
    {
        approver: null,
        label: 'Checked By',
        label_id: MRV_APPROVER.CHECKED_BY,
        order: 1,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Approved By',
        label_id: MRV_APPROVER.APPROVED_BY,
        order: 2,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Audited By',
        label_id: MRV_APPROVER.AUDITED_BY,
        order: 3,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Confirmed By',
        label_id: MRV_APPROVER.CONFIRMED_BY,
        order: 4,
        showRequiredMsg: false
    },
]