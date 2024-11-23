import type { CreateMCTApprover } from "./mct-approver.types";


export const MCT_DEFAULT_APPROVERS: CreateMCTApprover[] = [
    {
        approver: null,
        label: 'Issued By',
        order: 1,
        showRequiredMsg: false
    },
]