import type { Employee } from "~/composables/hr/employee/employee.types"


export interface GasSlipApprover {
    id: string
    approver_id: string
    approver: Employee | null
    date_approval: string | null
    notes: string
    status: APPROVAL_STATUS,
    label: string
    order: number
  }


  export interface CreateGasSlipApprover {
    approver: Employee | null
    label: string
    order: number
    showRequiredMsg: boolean
  }


  export interface ChangeApproverResponse {
    success: boolean
    msg: string
    data?: GasSlipApprover
  }