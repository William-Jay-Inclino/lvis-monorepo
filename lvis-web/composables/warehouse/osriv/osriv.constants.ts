import type { CreateOSRIVApprover } from "./osriv-approver.types";


export const enum OSRIV_APPROVER{
    SUPERVISOR = 'supervisor',
    WAREHOUSE_CUSTODIAN = 'warehouse_custodian',
}

export const OSRIV_DEFAULT_APPROVERS: CreateOSRIVApprover[] = [
    {
        approver: null,
        label: 'Imd. Supervisor',
        label_id: OSRIV_APPROVER.SUPERVISOR,
        order: 1,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Approved By',
        label_id: OSRIV_APPROVER.WAREHOUSE_CUSTODIAN,
        order: 2,
        showRequiredMsg: false
    },
]