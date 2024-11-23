import type { CreateOSRIVApprover } from "./osriv-approver.types";


export const OSRIV_DEFAULT_APPROVERS: CreateOSRIVApprover[] = [
    {
        approver: null,
        label: 'Imd. Supervisor',
        order: 1,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Warehouse Custodian',
        order: 2,
        showRequiredMsg: false
    },
]