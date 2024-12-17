import type { CreateGasSlipApprover } from "./gas-slip.approver.types";


export const GAS_SLIP_DEFAULT_APPROVERS: CreateGasSlipApprover[] = [
    {
        approver: null,
        label: 'Immediate Superior',
        order: 1,
        showRequiredMsg: false
    },
    {
        approver: null,
        label: 'Dep Head / OIC',
        order: 2,
        showRequiredMsg: false
    },
]