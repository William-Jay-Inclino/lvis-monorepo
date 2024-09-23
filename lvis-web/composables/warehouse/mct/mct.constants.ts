import type { CreateMCTApprover } from "./mct-approver.types";


export const enum MCT_APPROVER{
    ISSUED_BY = 'issued_by',
}

export const MCT_DEFAULT_APPROVERS: CreateMCTApprover[] = [
    {
        approver: null,
        label: 'Issued By',
        label_id: MCT_APPROVER.ISSUED_BY,
        order: 1,
        showRequiredMsg: false
    },
]