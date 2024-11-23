import type { CreateMSTApprover } from "./mst-approver.types";

export const MST_DEFAULT_APPROVERS: CreateMSTApprover[] = [
    {
        approver: null,
        label: 'Received By',
        order: 1,
        showRequiredMsg: false
    },
]

