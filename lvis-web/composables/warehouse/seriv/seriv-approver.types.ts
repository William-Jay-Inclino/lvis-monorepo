import type { Employee } from "~/composables/hr/employee/employee.types"


export interface SerivApproverMutationResponse {
  success: boolean
  msg: string
  data?: SERIVApprover
}


export interface SERIVApprover {
  id: string
  approver: Employee
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
}

export interface CreateSERIVApprover {
  approver: Employee | null
  label: string
  order: number
  showRequiredMsg: boolean
}