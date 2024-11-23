import type { CreateSERIVApprover } from "./seriv-approver.types";


export const SERIV_DEFAULT_APPROVERS: CreateSERIVApprover[] = [
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
    {
        approver: null,
        label: 'Warehouse Custodian',
        order: 5,
        showRequiredMsg: false
    },
]